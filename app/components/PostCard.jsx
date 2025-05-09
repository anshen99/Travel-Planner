'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  
  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(prev => !prev);
  };

  return (
    <div className="post-card border rounded-lg overflow-hidden bg-white shadow mb-6">
      {/* User info header */}
      <div className="flex items-center p-4 border-b">
        <img 
          src={post.user?.avatar || 'https://via.placeholder.com/40'} 
          alt={post.user?.name} 
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <Link href={`/profile/${post.user?.id}`} className="font-semibold hover:underline">
            {post.user?.name || "Anonymous"}
          </Link>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>
      
      {/* Images - gallery style if multiple */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <img 
            src={post.images[0]} 
            alt={post.title} 
            className="w-full object-cover max-h-96"
          />
        </div>
      )}
      
      {/* Post content */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="mb-3">{post.description}</p>
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Dates:</span> {post.dates}
        </div>
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-semibold">Destination:</span> {post.destinations}
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex space-x-6">
            <button 
              onClick={handleLike} 
              className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-500'}`}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{likesCount}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500">
              <FaComment />
              <span>{post.comments || 0}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500">
              <FaShare />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 