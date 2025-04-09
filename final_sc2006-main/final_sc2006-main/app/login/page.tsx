"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { login } from "@/lib/auth"; // Firebase login function

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await login(email, password);
      router.push("/dashboard"); // redirect on successful login
    } catch (err: any) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 relative z-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Login to EduPath</h2>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot password link */}
          <div className="text-right mb-4">
            <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-sm text-center text-black mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>

      {/* Background SVG image */}
      <div className="absolute bottom-0 right-0 mb-4 mr-4 z-0">
        <img
          src="/undraw_authentication_tbfc.svg"
          alt="Authentication"
          className="h-auto w-40 md:w-64"
        />
      </div>
    </div>
  );
}