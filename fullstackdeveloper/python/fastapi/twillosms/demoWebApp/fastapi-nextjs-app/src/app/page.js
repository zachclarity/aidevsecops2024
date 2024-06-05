'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("x IN")
      const response = await axios.post('http://localhost:8000/login', { username, password });
      const { access_token } = response.data;
      setAccessToken(access_token);
      setMessage('Logged in successfully');
    } catch (error) {
      setMessage('Invalid credentials');
    }
  };

  const handleSendOTP = async () => {
    try {
      await axios.post('/api/otp/send', { access_token: accessToken });
      setMessage('OTP sent successfully');
    } catch (error) {
      setMessage('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axios.post('/api/otp/verify', { access_token: accessToken, otp });
      setMessage('OTP verified successfully');
    } catch (error) {
      setMessage('Invalid OTP');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {accessToken && (
        <div>
          <h2>Two-Factor Authentication</h2>
          <button onClick={handleSendOTP}>Send OTP</button>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      )}

      <p>{message}</p>
    </div>
  );
}