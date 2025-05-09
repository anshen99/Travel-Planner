import { useState } from "react";
export default function CreatePost({ onPost }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dates: "",
    destinations: "",
    images: []
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = e => setForm({ ...form, images: Array.from(e.target.files) });

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "images") v.forEach(file => data.append("images", file));
      else data.append(k, v);
    });
    await fetch("/api/posts", { method: "POST", body: data });
    onPost && onPost();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <input name="title" placeholder="Trip Title" onChange={handleChange} className="w-full border p-2 rounded" />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="dates" placeholder="Dates (e.g. 2024-06-01 to 2024-06-10)" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="destinations" placeholder="Destinations Visited" onChange={handleChange} className="w-full border p-2 rounded" />
      <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="w-full" />
      <button type="submit" className="w-full bg-primary text-white p-2 rounded">Share Journey</button>
    </form>
  );
} 