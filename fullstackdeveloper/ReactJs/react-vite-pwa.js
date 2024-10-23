// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'React PWA App',
        short_name: 'React PWA',
        description: 'A simple React PWA with three pages',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})

// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React PWA</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// src/index.css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

.nav {
  background: #333;
  padding: 1rem;
}

.nav a {
  color: white;
  text-decoration: none;
  margin-right: 1rem;
}

.nav a:hover {
  text-decoration: underline;
}

.nav a.active {
  color: #61dafb;
}

.content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

// src/App.jsx
import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <div>
      <nav className="nav">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

// src/pages/Home.jsx
function Home() {
  return (
    <div>
      <h1>Welcome to Our React PWA</h1>
      <p>This is the home page of our Progressive Web App. It demonstrates basic routing and PWA capabilities using React and Vite.</p>
    </div>
  )
}

export default Home

// src/pages/About.jsx
function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>We are a demo React PWA application showing how to create a simple multi-page progressive web app using Vite.js and React.</p>
    </div>
  )
}

export default About

// src/pages/Contact.jsx
function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with us at example@email.com or follow us on social media.</p>
    </div>
  )
}

export default Contact
