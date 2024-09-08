// pages/index.js
import { useState, useEffect } from 'react'

export default function Home() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/hello?name=World')
      .then(response => response.text())
      .then(data => setGreeting(data))
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <div>
      <h1>{greeting}</h1>
    </div>
  )
}
