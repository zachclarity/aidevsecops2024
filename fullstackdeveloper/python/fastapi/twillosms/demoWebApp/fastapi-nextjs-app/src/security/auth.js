import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
        console.log("LOGG IN")
      const { username, password } = req.body;
      const response = await axios.post('http://localhost:8000/login', { username, password });
      const { access_token } = response.data;
      res.status(200).json({ access_token });
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}