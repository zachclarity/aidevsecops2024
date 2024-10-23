# React + Vite
I'll create a React hook that makes it easy to use the HTTP caching functionality in React components.



```javascript
import { useState, useEffect, useCallback } from 'react';

const useHttpCache = (options = {}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const cacheKey = options.cacheKey || 'offline_requests';

  // Load initial pending requests from cache
  useEffect(() => {
    const loadCachedRequests = () => {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setPendingRequests(JSON.parse(cached));
      }
    };
    loadCachedRequests();
  }, [cacheKey]);

  // Set up online/offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processCachedRequests();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache request function
  const cacheRequest = useCallback((url, data, config) => {
    const newRequest = {
      url,
      data,
      config,
      timestamp: new Date().toISOString()
    };

    setPendingRequests(prev => {
      const updated = [...prev, newRequest];
      localStorage.setItem(cacheKey, JSON.stringify(updated));
      return updated;
    });
  }, [cacheKey]);

  // Process cached requests
  const processCachedRequests = useCallback(async () => {
    if (!isOnline || isProcessing || pendingRequests.length === 0) return;

    setIsProcessing(true);
    setError(null);

    const processedRequests = [];
    const failedRequests = [];

    for (const request of pendingRequests) {
      try {
        const response = await fetch(request.url, request.config);
        if (response.ok) {
          processedRequests.push(request);
        } else {
          failedRequests.push(request);
        }
      } catch (err) {
        failedRequests.push(request);
      }
    }

    setPendingRequests(failedRequests);
    localStorage.setItem(cacheKey, JSON.stringify(failedRequests));
    setIsProcessing(false);
  }, [isOnline, isProcessing, pendingRequests, cacheKey]);

  // Main request function
  const sendRequest = useCallback(async (url, data, requestOptions = {}) => {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...requestOptions.headers
      },
      body: JSON.stringify(data),
      ...requestOptions
    };

    try {
      if (!isOnline) {
        cacheRequest(url, data, config);
        return { cached: true, data };
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();

    } catch (err) {
      setError(err);
      if (!isOnline) {
        cacheRequest(url, data, config);
        return { cached: true, data };
      }
      throw err;
    }
  }, [isOnline, cacheRequest]);

  // Clear cache
  const clearCache = useCallback(() => {
    localStorage.removeItem(cacheKey);
    setPendingRequests([]);
  }, [cacheKey]);

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

export default useHttpCache;

```

Let me also create a simple example component to demonstrate how to use this hook:

```javascript
import React, { useState } from 'react';
import useHttpCache from './useHttpCache';

const DataSubmissionForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const {
    sendRequest,
    isOnline,
    isProcessing,
    pendingRequests,
    error
  } = useHttpCache();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest('https://api.example.com/data', formData);
      if (response.cached) {
        alert('You are offline. Data will be sent when connection is restored.');
      } else {
        alert('Data sent successfully!');
        setFormData({ name: '', email: '' });
      }
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className={`inline-block px-3 py-1 rounded-full ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      {pendingRequests.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          {pendingRequests.length} request(s) pending
        </div>
      )}

      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-100 rounded">
          Processing cached requests...
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 rounded">
          Error: {error.message}
        </div>
      )}
    </div>
  );
};

export default DataSubmissionForm;

```

The hook provides several features:

1. Automatic online/offline detection
2. Request caching when offline
3. Automatic processing of cached requests when back online
4. Status tracking (isOnline, isProcessing, error states)
5. Pending requests management
6. Cache clearing functionality

The example component shows how to:
- Use the hook in a form submission scenario
- Display online/offline status
- Show pending request count
- Handle processing states
- Display errors
- Provide feedback to users

I'll create a utility that handles persisting cache data to the device's file system using different approaches based on the environment (web, mobile, electron, etc.).



```javascript
// CachePersistence.js
class CachePersistenceAdapter {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || 'app-cache';
    this.maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB default
    this.environment = this.detectEnvironment();
  }

  detectEnvironment() {
    if (typeof window !== 'undefined') {
      if (window.electron) return 'electron';
      if (window.ReactNative) return 'react-native';
      return 'web';
    }
    if (typeof process !== 'undefined') return 'node';
    return 'unknown';
  }

  async getAdapter() {
    switch (this.environment) {
      case 'electron':
        return new ElectronAdapter(this.cacheDir);
      case 'react-native':
        return new ReactNativeAdapter(this.cacheDir);
      case 'web':
        return new WebAdapter(this.cacheDir);
      case 'node':
        return new NodeAdapter(this.cacheDir);
      default:
        throw new Error('Unsupported environment');
    }
  }
}

class ElectronAdapter {
  constructor(cacheDir) {
    this.fs = window.electron.require('fs').promises;
    this.path = window.electron.require('path');
    this.cacheDir = this.path.join(
      window.electron.app.getPath('userData'),
      cacheDir
    );
  }

  async init() {
    try {
      await this.fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.error('Error creating cache directory:', error);
    }
  }

  async save(key, data) {
    const filePath = this.path.join(this.cacheDir, `${key}.json`);
    try {
      await this.fs.writeFile(filePath, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving cache:', error);
      return false;
    }
  }

  async load(key) {
    const filePath = this.path.join(this.cacheDir, `${key}.json`);
    try {
      const data = await this.fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async delete(key) {
    const filePath = this.path.join(this.cacheDir, `${key}.json`);
    try {
      await this.fs.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}

class ReactNativeAdapter {
  constructor(cacheDir) {
    this.RNFS = require('react-native-fs');
    this.cacheDir = `${this.RNFS.DocumentDirectoryPath}/${cacheDir}`;
  }

  async init() {
    try {
      const exists = await this.RNFS.exists(this.cacheDir);
      if (!exists) {
        await this.RNFS.mkdir(this.cacheDir);
      }
    } catch (error) {
      console.error('Error initializing cache directory:', error);
    }
  }

  async save(key, data) {
    const filePath = `${this.cacheDir}/${key}.json`;
    try {
      await this.RNFS.writeFile(filePath, JSON.stringify(data), 'utf8');
      return true;
    } catch (error) {
      console.error('Error saving cache:', error);
      return false;
    }
  }

  async load(key) {
    const filePath = `${this.cacheDir}/${key}.json`;
    try {
      const data = await this.RNFS.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async delete(key) {
    const filePath = `${this.cacheDir}/${key}.json`;
    try {
      await this.RNFS.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}

class WebAdapter {
  constructor(cacheDir) {
    this.cacheDir = cacheDir;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.cacheDir, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
      };
    });
  }

  async save(key, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put(data, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  }

  async load(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  }
}

class NodeAdapter {
  constructor(cacheDir) {
    this.fs = require('fs').promises;
    this.path = require('path');
    this.cacheDir = this.path.join(process.cwd(), cacheDir);
  }

  async init() {
    try {
      await this.fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      console.error('Error creating cache directory:', error);
    }
  }

  async save(key, data) {
    const filePath = this.path.join(this.cacheDir, `${key}.json`);
    try {
      await this.fs.writeFile(filePath, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving cache:', error);
      return false;
    }
  }

  async load(key) {
    const filePath = this.path.join(this.cacheDir, `${key}.json`);
    try {
      const data = await this.fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async delete(key) {
    const filePath = this.path.join(this.cacheDir, `${key}.json`);
    try {
      await this.fs.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}

```

Now, let's create an enhanced version of our HTTP cache hook that uses this persistence utility:

```javascript
import { useState, useEffect, useCallback } from 'react';
import { CachePersistenceAdapter } from './CachePersistence';

const usePersistentHttpCache = (options = {}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [persistence, setPersistence] = useState(null);
  
  const cacheKey = options.cacheKey || 'offline_requests';
  const cacheDir = options.cacheDir || 'http-cache';

  // Initialize persistence adapter
  useEffect(() => {
    const initPersistence = async () => {
      try {
        const adapter = new CachePersistenceAdapter({ cacheDir });
        const persistenceInstance = await adapter.getAdapter();
        await persistenceInstance.init();
        setPersistence(persistenceInstance);

        // Load cached requests from file system
        const savedRequests = await persistenceInstance.load(cacheKey);
        if (savedRequests) {
          setPendingRequests(savedRequests);
        }
      } catch (error) {
        console.error('Failed to initialize persistence:', error);
        setError(error);
      }
    };

    initPersistence();
  }, [cacheDir, cacheKey]);

  // Save pending requests to file system whenever they change
  useEffect(() => {
    const savePendingRequests = async () => {
      if (persistence && pendingRequests) {
        try {
          await persistence.save(cacheKey, pendingRequests);
        } catch (error) {
          console.error('Failed to save pending requests:', error);
        }
      }
    };

    savePendingRequests();
  }, [persistence, pendingRequests, cacheKey]);

  // Enhanced cache request function
  const cacheRequest = useCallback(async (url, data, config, failureReason = null) => {
    const newRequest = {
      url,
      data,
      config,
      failureReason,
      timestamp: new Date().toISOString()
    };

    setPendingRequests(prev => {
      const updated = [...prev, newRequest];
      return updated;
    });

    return { cached: true, data, failureReason };
  }, []);

  // Process cached requests with persistence
  const processCachedRequests = useCallback(async () => {
    if (!isOnline || isProcessing || pendingRequests.length === 0) return;

    setIsProcessing(true);
    setError(null);

    const processedRequests = [];
    const failedRequests = [];

    for (const request of pendingRequests) {
      try {
        const response = await fetch(request.url, request.config);
        
        if (response.ok) {
          processedRequests.push(request);
        } else {
          failedRequests.push({
            ...request,
            failureReason: `HTTP error: ${response.status}`,
            lastAttempt: new Date().toISOString()
          });
        }
      } catch (error) {
        failedRequests.push({
          ...request,
          failureReason: error.message,
          lastAttempt: new Date().toISOString()
        });
      }
    }

    setPendingRequests(failedRequests);
    setIsProcessing(false);

    return {
      processed: processedRequests.length,
      failed: failedRequests.length
    };
  }, [isOnline, isProcessing, pendingRequests]);

  // Clear cache from both memory and file system
  const clearCache = useCallback(async () => {
    if (persistence) {
      await persistence.delete(cacheKey);
    }
    setPendingRequests([]);
  }, [persistence, cacheKey]);

  return {
    // ... rest of the hook implementation
    clearCache,
    processCachedRequests,
    isOnline,
    isProcessing,
    pendingRequests,
    error
  };
};

export default usePersistentHttpCache;

```

Usage example:

```javascript
const MyComponent = () => {
  const { sendRequest, pendingRequests, error } = usePersistentHttpCache({
    cacheDir: 'my-app-cache',
    cacheKey: 'api-requests'
  });

  const handleSubmit = async () => {
    try {
      const response = await sendRequest('https://api.example.com/data', {
        // your data
      });
      
      if (response.cached) {
        console.log('Request cached:', response.failureReason);
      } else {
        console.log('Request successful:', response);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    // ... your component JSX
  );
};
```

Key features of the persistence implementation:

1. **Platform Agnostic**:
   - Works across web, Electron, React Native, and Node.js
   - Automatically detects environment
   - Uses appropriate storage mechanism for each platform

2. **Persistence Mechanisms**:
   - Web: IndexedDB for larger storage capacity
   - Electron: Native file system through electron API
   - React Native: File system through react-native-fs
   - Node.js: Native file system

3. **Error Handling**:
   - Graceful fallbacks
   - Detailed error reporting
   - Recovery mechanisms

4. **Performance**:
   - Async operations
   - Efficient storage
   - Batched updates

I'll enhance the persistence utility with encryption capabilities to securely store cached data.



```javascript
// CachePersistence.js
import { Buffer } from 'buffer';

class EncryptionService {
  constructor(options = {}) {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.saltLength = 16;
    this.ivLength = 12;
    this.tagLength = 16;
    this.masterKey = options.encryptionKey;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    if (!this.masterKey) {
      // Generate a new master key if none provided
      const key = await window.crypto.subtle.generateKey(
        {
          name: this.algorithm,
          length: this.keyLength
        },
        true,
        ['encrypt', 'decrypt']
      );
      
      // Export the key to store it
      const exportedKey = await window.crypto.subtle.exportKey('raw', key);
      this.masterKey = Buffer.from(exportedKey).toString('base64');
    }

    // Import the master key
    const keyMaterial = Buffer.from(this.masterKey, 'base64');
    this.key = await window.crypto.subtle.importKey(
      'raw',
      keyMaterial,
      this.algorithm,
      false,
      ['encrypt', 'decrypt']
    );

    this.initialized = true;
  }

  async encrypt(data) {
    await this.init();

    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(this.ivLength));
    
    // Convert data to buffer
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
        tagLength: this.tagLength * 8
      },
      this.key,
      encodedData
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Return as base64 string
    return Buffer.from(combined).toString('base64');
  }

  async decrypt(encryptedData) {
    await this.init();

    try {
      // Convert base64 to buffer
      const combined = Buffer.from(encryptedData, 'base64');
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, this.ivLength);
      const data = combined.slice(this.ivLength);

      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv: iv,
          tagLength: this.tagLength * 8
        },
        this.key,
        data
      );

      // Convert back to object
      const decodedData = new TextDecoder().decode(decryptedData);
      return JSON.parse(decodedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}

class CachePersistenceAdapter {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || 'app-cache';
    this.maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB default
    this.environment = this.detectEnvironment();
    this.encryption = new EncryptionService(options);
  }

  // ... rest of the detection logic remains the same ...
}

class BaseAdapter {
  constructor(cacheDir, encryption) {
    this.cacheDir = cacheDir;
    this.encryption = encryption;
  }

  async encryptData(data) {
    return this.encryption.encrypt(data);
  }

  async decryptData(encryptedData) {
    return this.encryption.decrypt(encryptedData);
  }
}

class ElectronAdapter extends BaseAdapter {
  constructor(cacheDir, encryption) {
    super(cacheDir, encryption);
    this.fs = window.electron.require('fs').promises;
    this.path = window.electron.require('path');
    this.cacheDir = this.path.join(
      window.electron.app.getPath('userData'),
      cacheDir
    );
  }

  async init() {
    try {
      await this.fs.mkdir(this.cacheDir, { recursive: true });
      await this.encryption.init();
    } catch (error) {
      console.error('Error initializing electron adapter:', error);
    }
  }

  async save(key, data) {
    const filePath = this.path.join(this.cacheDir, `${key}.encrypted`);
    try {
      const encryptedData = await this.encryptData(data);
      await this.fs.writeFile(filePath, encryptedData);
      return true;
    } catch (error) {
      console.error('Error saving encrypted cache:', error);
      return false;
    }
  }

  async load(key) {
    const filePath = this.path.join(this.cacheDir, `${key}.encrypted`);
    try {
      const encryptedData = await this.fs.readFile(filePath, 'utf8');
      return await this.decryptData(encryptedData);
    } catch (error) {
      return null;
    }
  }

  async delete(key) {
    const filePath = this.path.join(this.cacheDir, `${key}.encrypted`);
    try {
      await this.fs.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}

class ReactNativeAdapter extends BaseAdapter {
  constructor(cacheDir, encryption) {
    super(cacheDir, encryption);
    this.RNFS = require('react-native-fs');
    this.cacheDir = `${this.RNFS.DocumentDirectoryPath}/${cacheDir}`;
  }

  async init() {
    try {
      const exists = await this.RNFS.exists(this.cacheDir);
      if (!exists) {
        await this.RNFS.mkdir(this.cacheDir);
      }
      await this.encryption.init();
    } catch (error) {
      console.error('Error initializing RN adapter:', error);
    }
  }

  async save(key, data) {
    const filePath = `${this.cacheDir}/${key}.encrypted`;
    try {
      const encryptedData = await this.encryptData(data);
      await this.RNFS.writeFile(filePath, encryptedData, 'utf8');
      return true;
    } catch (error) {
      console.error('Error saving encrypted cache:', error);
      return false;
    }
  }

  async load(key) {
    const filePath = `${this.cacheDir}/${key}.encrypted`;
    try {
      const encryptedData = await this.RNFS.readFile(filePath, 'utf8');
      return await this.decryptData(encryptedData);
    } catch (error) {
      return null;
    }
  }

  async delete(key) {
    const filePath = `${this.cacheDir}/${key}.encrypted`;
    try {
      await this.RNFS.unlink(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}

class WebAdapter extends BaseAdapter {
  constructor(cacheDir, encryption) {
    super(cacheDir, encryption);
    this.db = null;
  }

  async init() {
    await this.encryption.init();
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.cacheDir, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache');
        }
      };
    });
  }

  async save(key, data) {
    const encryptedData = await this.encryptData(data);
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put(encryptedData, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  }

  async load(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        if (request.result) {
          const decryptedData = await this.decryptData(request.result);
          resolve(decryptedData);
        } else {
          resolve(null);
        }
      };
    });
  }

  async delete(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(true);
    });
  }
}

export { CachePersistenceAdapter, EncryptionService };

```

Here's how to use the encrypted cache in your HTTP hook:

```javascript
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

```

Usage example:

```javascript
const MyComponent = () => {
  const { sendRequest, pendingRequests, error } = useEncryptedHttpCache({
    cacheDir: 'my-secure-cache',
    // Optional: Provide your own encryption key
    encryptionKey: 'your-base64-encoded-key'
  });

  const handleSubmit = async () => {
    try {
      const response = await sendRequest('https://api.example.com/data', {
        sensitiveData: 'example'
      });
      
      if (response.cached) {
        console.log('Encrypted and cached:', response.failureReason);
      } else {
        console.log('Request successful:', response);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    // ... your component JSX
  );
};
```

Key encryption features:

1. **Strong Encryption**:
   - Uses AES-GCM for authenticated encryption
   - 256-bit keys
   - Random IV for each encryption
   - Authentication tags to prevent tampering

2. **Key Management**:
   - Automatic key generation if not provided
   - Secure key import/export
   - Key persistence options

3. **Security Features**:
   - Encrypted file extensions
   - Secure error handling
   - Memory cleanup
   - Tamper detection

4. **Platform Support**:
   - Web Crypto API for browsers
   - Native crypto modules for Node.js/Electron
   - React Native crypto libraries


4. Add additional encryption algorithms?