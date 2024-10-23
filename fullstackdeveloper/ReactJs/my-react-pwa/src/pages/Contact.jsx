
import { useState, useEffect, useCallback } from 'react';


import useHttpCache from '../useHttpCache';

function Contact() {

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
      <div>
        <h1>Contact Us</h1>
        <div className="mb-4">
        <div className={`inline-block px-3 py-1 rounded-full ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isOnline ? 'Online' : 'Offline'}
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
        <p>Get in touch with us at example@email.com or follow us on social media.</p>
      </div>
    )
  }
  
  export default Contact