'use client'; // Mark as a Client Component for client-side navigation and form interaction

import LoginForm from '../components/LoginForm' // Adjusted import path

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <LoginForm />
        <div className="mt-4 text-center">
          Don&apos;t have an account? <a href="/register" className="text-primary underline">Register</a>
        </div>
      </div>
    </div>
  )
} 