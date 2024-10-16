
import { createCookieSessionStorage } from '@remix-run/node';

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
      secrets: ['s3cr3t'], // In production, use a proper secret management system
      secure: process.env.NODE_ENV === 'production',
    },
  });

export { getSession, commitSession, destroySession };