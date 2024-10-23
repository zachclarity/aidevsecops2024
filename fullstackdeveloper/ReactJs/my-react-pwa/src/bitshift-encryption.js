import {ByteConverter} from './byte-string-converter'

export class BitshiftCrypto {
  constructor(key = 42) {
    // Use a simple number as encryption key
    this.key = key % 256; // Keep key in byte range
    this.salt = 0b10110111; // Binary literal for additional scrambling
  }

  encrypt(text) {
    try {
      // Convert string to array of character codes
      const bytes = Array.from(text).map(char => char.charCodeAt(0));
      console.log(text)
      console.log(ByteConverter.stringToBytes(text))
      console.log(ByteConverter.bytesToString(bytes))
      // Apply bitwise operations to each byte
      const encryptedBytes = bytes.map((byte, index) => {
        // Multiple transformations for better scrambling:
        let encrypted = byte;
        
        // 1. XOR with key
        encrypted = encrypted ^ this.key;
        
        // 2. Rotate left by index (to make each position unique)
        encrypted = ((encrypted << (index % 7)) | (encrypted >> (8 - (index % 7)))) & 0xFF;
        
        // 3. XOR with salt
        encrypted = encrypted ^ this.salt;
        
        // 4. Add position-based offset
        encrypted = (encrypted + index) & 0xFF;
    
        return encrypted;
      });
      
      console.log(encryptedBytes)
      // Convert to hex string for easier storage/transmission
      return encryptedBytes.map(byte => 
        byte.toString(16).padStart(2, '0')
      ).join('');
    
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  decrypt(encryptedHex) {
    try {
      // Convert hex string back to bytes
      const encryptedBytes = encryptedHex.match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16));
      
      // Reverse the encryption operations
      const decryptedBytes = encryptedBytes.map((byte, index) => {
        let decrypted = byte;
        
        // 1. Subtract position-based offset
        decrypted = (decrypted - index) & 0xFF;
        
        // 2. XOR with salt
        decrypted = decrypted ^ this.salt;
        
        // 3. Rotate right by index (reverse of left rotation)
        decrypted = ((decrypted >> (index % 7)) | (decrypted << (8 - (index % 7)))) & 0xFF;
        
        // 4. XOR with key
        decrypted = decrypted ^ this.key;
        
        return decrypted;
      });
      
      // Convert back to string
      return String.fromCharCode(...decryptedBytes);
      
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Utility method to visualize bit patterns
  static showBits(number) {
    return number.toString(2).padStart(8, '0');
  }
}

// Example usage with debugging
class BitshiftDemo {
  static runDemo() {
    console.log('Bitshift Encryption Demo\n' + '-'.repeat(25));
    
    const message = "Hello, World!";
    const key = 42;
    
    console.log(`Original message: "${message}"`);
    console.log(`Using key: ${key} (${BitshiftCrypto.showBits(key)})\n`);
    
    const crypto = new BitshiftCrypto(key);
    
    // Encrypt with debug info
    console.log('Encryption process:');
    const encrypted = crypto.encrypt(message);
    
    // Show the first character's transformation
    const firstChar = message.charCodeAt(0);  // 'H'
    console.log(`First character 'H':`);
    console.log(`Original bits: ${BitshiftCrypto.showBits(firstChar)}`);
    console.log(`After XOR:    ${BitshiftCrypto.showBits(firstChar ^ key)}`);
    console.log(`After rotate: ${BitshiftCrypto.showBits(((firstChar ^ key) << 0) & 0xFF)}`);
    console.log(`After salt:   ${BitshiftCrypto.showBits(((firstChar ^ key) << 0) & 0xFF ^ crypto.salt)}\n`);
    
    console.log(`Encrypted (hex): ${encrypted}\n`);
    
    // Decrypt
    const decrypted = crypto.decrypt(encrypted);
    console.log(`Decrypted: "${decrypted}"`);
    
    // Verify
    console.log(`\nVerification: ${decrypted === message ? 'SUCCESS' : 'FAILED'}`);
    
    return { message, encrypted, decrypted };
  }
}
