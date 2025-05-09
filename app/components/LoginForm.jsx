'use client'; // Mark as a Client Component

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    
    setLoading(true);
    try {
      // Use our mock login function instead of API call
      const result = await login(form.email, form.password);
      
      if (result.success) {
        router.push('/'); // Redirect to home page on success
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
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
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
      
      <div className="bg-gray-100 p-3 rounded text-sm mt-4">
        <h3 className="font-bold">Test Account:</h3>
        <p>Email: test@example.com</p>
        <p>Password: password123</p>
      </div>
    </form>
  );
} 