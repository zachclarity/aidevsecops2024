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

