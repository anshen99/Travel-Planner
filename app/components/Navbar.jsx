'use client'

import Link from 'next/link';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-primary">
          TravelPlanner
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-primary">Home</Link>
          {user ? (
            <>
              <Link href="/itinerary" className="text-gray-700 hover:text-primary">Itinerary</Link>
              <Link href="/feed" className="text-gray-700 hover:text-primary">Feed</Link>
              <Link href="/profile" className="text-gray-700 hover:text-primary">Profile</Link>
              <button onClick={logout} className="text-gray-700 hover:text-primary">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-primary">Login</Link>
              <Link href="/register" className="text-gray-700 hover:text-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 