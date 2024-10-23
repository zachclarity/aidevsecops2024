export class ByteConverter {
  // Convert string to byte array
  static stringToBytes(str) {
    return Array.from(str).map(char => char.charCodeAt(0));
  }

  // Convert byte array to string
  static bytesToString(bytes) {
    return String.fromCharCode(...bytes);
  }

  // Convert string to hex string
  static stringToHex(str) {
    return Array.from(str)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }

  // Convert hex string to normal string
  static hexToString(hex) {
    return hex.match(/.{1,2}/g)
      ?.map(byte => String.fromCharCode(parseInt(byte, 16)))
      .join('') || '';
  }

  // Convert string to binary string
  static stringToBinary(str) {
    return Array.from(str)
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  }

  // Convert binary string to normal string
  static binaryToString(binary) {
    return binary.split(' ')
      .map(byte => String.fromCharCode(parseInt(byte, 2)))
      .join('');
  }

  // Convert string to Base64
  static stringToBase64(str) {
    return btoa(str);
  }

  // Convert Base64 to string
  static base64ToString(base64) {
    return atob(base64);
  }

  // Convert UTF-16 string to UTF-8 bytes
  static stringToUTF8Bytes(str) {
    return new TextEncoder().encode(str);
  }

  // Convert UTF-8 bytes to string
  static UTF8BytesToString(bytes) {
    return new TextDecoder().decode(bytes);
  }

  // Demonstrate all conversions
  static demonstrateConversions(input) {
    console.log('Original String:', input);

    // Bytes representation
    const bytes = this.stringToBytes(input);
    console.log('To Bytes:', bytes);
    console.log('Back to String:', this.bytesToString(bytes));

    // Hex representation
    const hex = this.stringToHex(input);
    console.log('To Hex:', hex);
    console.log('Back to String:', this.hexToString(hex));

    // Binary representation
    const binary = this.stringToBinary(input);
    console.log('To Binary:', binary);
    console.log('Back to String:', this.binaryToString(binary));

    // Base64 representation
    const base64 = this.stringToBase64(input);
    console.log('To Base64:', base64);
    console.log('Back to String:', this.base64ToString(base64));

    // UTF-8 representation
    const utf8Bytes = this.stringToUTF8Bytes(input);
    console.log('To UTF-8 Bytes:', utf8Bytes);
    console.log('Back to String:', this.UTF8BytesToString(utf8Bytes));
  }
}
