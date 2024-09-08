'use client'

import React, { useState, useEffect, FormEvent } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function Home() {
  const [greeting, setGreeting] = useState<string>('')
  const [name, setName] = useState<string>('')

  const fetchGreeting = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/hello?name=${encodeURIComponent(name)}`)
      const data = await response.text()
      setGreeting(data)
    } catch (error) {
      console.error('Error:', error)
      setGreeting('Failed to fetch greeting')
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    fetchGreeting()
  }

  useEffect(() => {
    fetchGreeting()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      from {API_URL}
      <h1>{greeting} from {API_URL}</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={name} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
          placeholder="Enter your name"
        />
        <button type="submit">Get Greeting</button>
      </form>
    </div>
  )
}