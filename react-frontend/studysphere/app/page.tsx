"use client"
import React from 'react';
import { Login } from "../app/login"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to StudySphere</h1>
        <p className="text-center mb-8 text-neutral-500 dark:text-neutral-400">
          Create and join classes, ask questions, and learn together.
        </p>
        <Login />
      </div>
    </div>
    
  )
}

