'use client'; // Mark as a Client Component

import RegisterForm from '../components/RegisterForm' // Adjusted import path

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <RegisterForm onRegister={() => window.location.href = '/login'} />
        <div className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-primary underline">Login</a>
        </div>
      </div>
    </div>
  )
} 