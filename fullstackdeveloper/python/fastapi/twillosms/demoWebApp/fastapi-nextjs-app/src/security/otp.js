import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { access_token } = req.body;
      const headers = { Authorization: `Bearer ${access_token}` };

      if (req.url === '/api/otp/send') {
        await axios.post('http://localhost:8000/send_otp', null, { headers });
        res.status(200).json({ message: 'OTP sent successfully' });
      } else if (req.url === '/api/otp/verify') {
        const { otp } = req.body;
        await axios.post('http://localhost:8000/verify_otp', { otp }, { headers });
        res.status(200).json({ message: 'OTP verified successfully' });
      }
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}