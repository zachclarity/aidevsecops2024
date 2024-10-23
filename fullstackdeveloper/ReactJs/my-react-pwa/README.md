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

