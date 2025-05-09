"use client"

import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function RegisterForm({ onRegister }) {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password || !form.name) {
      setError("All fields required");
      return;
    }

    setLoading(true);
    try {
      // Use our mock register function instead of API call
      const result = await register(form.name, form.email, form.password);
      
      if (result.success) {
        if (onRegister) onRegister();
        else window.location.href = '/';
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <input 
        name="name" 
        placeholder="Name" 
        onChange={handleChange} 
        className="w-full border p-2 rounded" 
        disabled={loading}
      />
      <input 
        name="email" 
        placeholder="Email" 
        onChange={handleChange} 
        className="w-full border p-2 rounded"
        disabled={loading} 
      />
      <input 
        name="password" 
        type="password" 
        placeholder="Password" 
        onChange={handleChange} 
        className="w-full border p-2 rounded"
        disabled={loading}
      />
      <button 
        type="submit" 
        className="w-full bg-primary text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      
      <div className="bg-gray-100 p-3 rounded text-sm mt-4">
        <h3 className="font-bold">Test Account Available:</h3>
        <p>Email: test@example.com</p>
        <p>Password: password123</p>
      </div>
    </form>
  );
} 