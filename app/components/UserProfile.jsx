import { useEffect, useState } from "react";
import PostCard from "./PostCard";
export default function UserProfile({ userId }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`/api/users/${userId}/posts`).then(res => res.json()).then(setPosts);
  }, [userId]);
  return (
    <div className="max-w-3xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">User's Journeys</h2>
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
} 