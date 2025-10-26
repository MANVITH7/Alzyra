// Polyfills for React Native
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js';

// Make Buffer available globally
global.Buffer = Buffer;

// Make crypto available globally for WebCrypto API
global.crypto = {
  subtle: {
    importKey: async (format, keyData, algorithm, extractable, keyUsages) => {
      // Convert key data to WordArray for crypto-js
      let key = null;
      if (format === 'raw') {
        const uint8Array = new Uint8Array(keyData);
        const wordArray = CryptoJS.lib.WordArray.create(uint8Array);
        key = wordArray;
      } else {
        throw new Error('Unsupported key format');
      }
      
      return { key, algorithm, keyUsages };
    },
          sign: async (algorithmName, key, data) => {
        const algorithm = key.algorithm;
        if (algorithm.name === 'HMAC' && algorithm.hash === 'SHA-256') {
          const keyData = key.key;
          const dataArray = new Uint8Array(data);
          const dataWordArray = CryptoJS.lib.WordArray.create(dataArray);
          
          const hash = CryptoJS.HmacSHA256(dataWordArray, keyData);
          // Convert WordArray to Uint8Array
          const bytes = [];
          for (let i = 0; i < hash.sigBytes; i++) {
            const byte = (hash.words[Math.floor(i / 4)] >>> (8 * (3 - i % 4))) & 0xff;
            bytes.push(byte);
          }
          return new Uint8Array(bytes);
        }
        throw new Error('Unsupported algorithm');
      }
  }
};
