'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import PrivateRoute from '../components/PrivateRoute';
import PostCard from '../components/PostCard';
import { getUserPosts } from '../components/mockData';
import { FaPen, FaMapMarkerAlt, FaCalendarAlt, FaGlobe } from 'react-icons/fa';

export default function ProfilePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    countries: 0,
    travelDays: 0
  });

  useEffect(() => {
    if (user) {
      // Simulate loading user's posts
      setTimeout(() => {
        const userPosts = getUserPosts(user.id, 5);
        setPosts(userPosts);
        
        // Calculate some stats
        setStats({
          totalTrips: userPosts.length,
          countries: [...new Set(userPosts.map(p => p.destinations.split(',')[0]))].length,
          travelDays: userPosts.reduce((acc, post) => acc + Math.floor(Math.random() * 10) + 3, 0)
        });
        
        setLoading(false);
      }, 800);
    }
  }, [user]);

  if (!user) return null;

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100 py-8 pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile header */}
          <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="px-6 pb-6">
              <div className="flex flex-col items-center sm:flex-row sm:items-start -mt-12 mb-4">
                <img 
                  src={user.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
                  className="w-24 h-24 rounded-full border-4 border-white" 
                  alt="User avatar" 
                />
                <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <button className="mt-2 flex items-center text-sm text-primary">
                    <FaPen className="mr-1" size={12} /> Edit Profile
                  </button>
                </div>
              </div>
              
              {/* Stats section */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.totalTrips}</div>
                  <div className="text-sm text-gray-600">Trips</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.countries}</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.travelDays}</div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* My journeys section */}
          <h1 className="text-2xl font-bold mb-6">My Journeys</h1>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FaGlobe className="text-gray-300 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">No Journeys Yet</h3>
              <p className="text-gray-600 mb-4">Share your adventures by creating a journey post on the feed page.</p>
              <a 
                href="/feed" 
                className="inline-block px-4 py-2 bg-primary text-white rounded"
              >
                Go to Feed
              </a>
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </PrivateRoute>
  );
} 