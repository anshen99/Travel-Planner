import { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("/api/posts").then(res => res.json()).then(setPosts);
  }, []);
  return (
    <div className="max-w-3xl mx-auto my-8 space-y-6">
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
} 