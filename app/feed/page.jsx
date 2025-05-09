'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import PrivateRoute from '../components/PrivateRoute';
import PostCard from '../components/PostCard';
import { getFeedPosts } from '../components/mockData';
import { FaImage, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', description: '', destinations: '', dates: '' });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading posts
    setTimeout(() => {
      setPosts(getFeedPosts(8));
      setLoading(false);
    }, 800);
  }, []);

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    
    // Create new post object
    const createdPost = {
      id: `post-${Date.now()}`,
      ...newPost,
      images: previewUrls.length ? previewUrls : [],
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' 
      },
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    
    // Add to posts state
    setPosts(prev => [createdPost, ...prev]);
    
    // Reset form
    setNewPost({ title: '', description: '', destinations: '', dates: '' });
    setImages([]);
    setPreviewUrls([]);
    setIsCreating(false);
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100 py-8 pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Create post card */}
          <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
            {!isCreating ? (
              <div className="p-4">
                <div 
                  className="flex items-center space-x-4 border rounded-full px-4 py-2 cursor-pointer" 
                  onClick={() => setIsCreating(true)}
                >
                  <img 
                    src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
                    className="w-10 h-10 rounded-full" 
                    alt="User avatar" 
                  />
                  <div className="text-gray-500 flex-1">Share your travel experience...</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitPost} className="p-4">
                <div className="flex items-center mb-4">
                  <img 
                    src={user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
                    className="w-10 h-10 rounded-full mr-3" 
                    alt="User avatar" 
                  />
                  <div className="font-medium">{user?.name || "You"}</div>
                </div>
                
                <input
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handlePostChange}
                  placeholder="Title of your journey"
                  className="w-full border rounded p-2 mb-3"
                  required
                />
                
                <textarea
                  name="description"
                  value={newPost.description}
                  onChange={handlePostChange}
                  placeholder="Describe your travel experience..."
                  className="w-full border rounded p-2 mb-3 min-h-[100px]"
                  required
                />
                
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center border rounded px-3 py-2">
                      <FaMapMarkerAlt className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        name="destinations"
                        value={newPost.destinations}
                        onChange={handlePostChange}
                        placeholder="Destination"
                        className="w-full outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center border rounded px-3 py-2">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        name="dates"
                        value={newPost.dates}
                        onChange={handlePostChange}
                        placeholder="Dates (e.g. May 1-15, 2023)"
                        className="w-full outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Image preview area */}
                {previewUrls.length > 0 && (
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    {previewUrls.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt="Preview" 
                        className="w-full h-40 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4 border-t pt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-primary">
                    <FaImage />
                    <span>Add Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsCreating(false)}
                      className="px-4 py-2 border rounded text-gray-600"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
          
          {/* Feed posts */}
          <h1 className="text-2xl font-bold mb-6">Travel Journeys</h1>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </PrivateRoute>
  );
} 