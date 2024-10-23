import { useState, useEffect, useCallback } from 'react';
import { CachePersistenceAdapter } from './CachePersistence';

const useEncryptedHttpCache = (options = {}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [persistence, setPersistence] = useState(null);

  // Generate or use provided encryption key
  const generateEncryptionKey = async () => {
    if (options.encryptionKey) return options.encryptionKey;
    
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    return Buffer.from(exportedKey).toString('base64');
  };

  // Initialize persistence with encryption
  useEffect(() => {
    const initPersistence = async () => {
      try {
        const encryptionKey = await generateEncryptionKey();
        const adapter = new CachePersistenceAdapter({
          cacheDir: options.cacheDir || 'encrypted-http-cache',
          encryptionKey
        });

        const persistenceInstance = await adapter.getAdapter();
        await persistenceInstance.init();
        setPersistence(persistenceInstance);

        // Load and decrypt cached requests
        const savedRequests = await persistenceInstance.load('pending_requests');
        if (savedRequests) {
          setPendingRequests(savedRequests);
        }
      } catch (error) {
        console.error('Failed to initialize encrypted persistence:', error);
        setError(error);
      }
    };

    initPersistence();
  }, [options.cacheDir, options.encryptionKey]);

  // Save encrypted pending requests
  useEffect(() => {
    const savePendingRequests = async () => {
      if (persistence && pendingRequests) {
        try {
          await persistence.save('pending_requests', pendingRequests);
        } catch (error) {
          console.error('Failed to save encrypted requests:', error);
        }
      }
    };

    savePendingRequests();
  }, [persistence, pendingRequests]);

  // ... rest of the hook implementation (sendRequest, processCachedRequests, etc.)

  return {
    sendRequest,
    clearCache,
    processCachedRequests,
    isOnline,
    isProcessing,
    pendingRequests,
    error
  };
};

export default useEncryptedHttpCache;
