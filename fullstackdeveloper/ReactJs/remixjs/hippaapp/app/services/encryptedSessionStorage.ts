// app/services/encryptedSessionStorage.ts
import { CookieParseOptions, CookieSerializeOptions, createCookieSessionStorage,SessionData, Session, SessionStorage } from "@remix-run/node";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.SESSION_ENCRYPTION_KEY ? process.env.SESSION_ENCRYPTION_KEY : "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"; // Must be 32 bytes for AES-256
const IV_LENGTH = 16; // For AES, this is always 16 bytes

console.log(ENCRYPTION_KEY.length)

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  console.log('throw new Error("SESSION_ENCRYPTION_KEY must be set to a 32-byte string")');
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
 // const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
 // let decrypted = decipher.update(encryptedText);
 // decrypted = Buffer.concat([decrypted, decipher.final()]);
  return encryptedText.toString();
}

const baseSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60, // 1 hour
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const sessionStorage: any = {
  async getSession(cookieHeader: string | null | undefined, options: CookieParseOptions | undefined) {
    const session = await baseSessionStorage.getSession(cookieHeader, options);
    return {
      ...session,
      get(key: any) {
        const value = session.get(key);
        return value ? decrypt(value) : null;
      },
      set(key: any, value: string) {
        session.set(key, encrypt(value));
      },
    };
  },
  async commitSession(session: Session<SessionData, SessionData>, options: CookieSerializeOptions | undefined) {
    return baseSessionStorage.commitSession(session, options);
  },
  async destroySession(session: Session<SessionData, SessionData>, options: CookieSerializeOptions | undefined) {
    return baseSessionStorage.destroySession(session, options);
  },
};

export const { getSession, commitSession, destroySession } = sessionStorage;