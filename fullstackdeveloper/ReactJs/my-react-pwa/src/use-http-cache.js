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
