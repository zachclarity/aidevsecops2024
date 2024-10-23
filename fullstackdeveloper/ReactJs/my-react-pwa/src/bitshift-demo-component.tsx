import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const BitshiftDemo = () => {
  const [text, setText] = useState('');
  const [key, setKey] = useState(42);
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');
  
  const crypto = new BitshiftCrypto(key);

  const handleEncrypt = () => {
    const result = crypto.encrypt(text);
    setEncrypted(result);
    setDecrypted('');
  };

  const handleDecrypt = () => {
    const result = crypto.decrypt(encrypted);
    setDecrypted(result);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Bitshift Encryption Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Encryption Key (0-255)</label>
          <input
            type="number"
            min="0"
            max="255"
            value={key}
            onChange={(e) => setKey(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Input Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleEncrypt}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Encrypt
          </button>
          <button
            onClick={handleDecrypt}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={!encrypted}
          >
            Decrypt
          </button>
        </div>

        {encrypted && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Encrypted (hex)</label>
            <div className="p-2 bg-gray-100 rounded break-all">
              {encrypted}
            </div>
          </div>
        )}

        {decrypted && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Decrypted Text</label>
            <div className="p-2 bg-gray-100 rounded">
              {decrypted}
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          Note: This is a simple demonstration using bitwise operations. 
          Don't use this for real encryption needs!
        </div>
      </CardContent>
    </Card>
  );
};

export default BitshiftDemo;
