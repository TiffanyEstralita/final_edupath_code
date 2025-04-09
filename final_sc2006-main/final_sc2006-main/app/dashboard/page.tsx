"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// SVGs for the sections
const RecommendationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-8 h-8 text-white"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 5l7 7-7 7M4 12h16"
    />
  </svg>
);

const VisualizationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-8 h-8 text-white"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 4v16h18V4H3zm9 12V8M3 12h18"
    />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-8 h-8 text-white"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 3h14a2 2 0 0 1 2 2v16l-7-4-7 4V5a2 2 0 0 1 2-2z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-8 h-8 text-white"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0-2C7.58 6 4 9.58 4 14s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"
    />
  </svg>
);

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Check user authentication status
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If no user, redirect to login page
        router.push("/login");
      } else {
        setLoading(false); // Set loading to false once the user is authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  // If still loading, show a loading spinner or nothing
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      {/* Content Container */}
      <div className="relative container mx-auto px-8 sm:px-16 lg:px-24 py-6 bg-transparent rounded-lg shadow-md z-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome to Your Dashboard
        </h2>
  
        {/* Dashboard Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recommendations */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center mb-4">
              <RecommendationIcon />
              <h3 className="text-xl font-semibold ml-3">Recommendations</h3>
            </div>
            <p className="text-sm mb-4">
              Get personalized job and course recommendations based on your profile.
            </p>
            <button
              onClick={() => router.push("/recommendations")}
              className="w-full bg-white text-blue-500 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              View Recommendations
            </button>
          </div>
  
          {/* Visualizations */}
          <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center mb-4">
              <VisualizationIcon />
              <h3 className="text-xl font-semibold ml-3">Visualizations</h3>
            </div>
            <p className="text-sm mb-4">
              See visual graphs and trends to help you make informed decisions.
            </p>
            <button
              onClick={() => router.push("/visualizations")}
              className="w-full bg-white text-green-500 py-2 rounded-lg hover:bg-green-50 transition"
            >
              View Visualizations
            </button>
          </div>
  
          {/* Bookmarks */}
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center mb-4">
              <BookmarkIcon />
              <h3 className="text-xl font-semibold ml-3">Bookmarks</h3>
            </div>
            <p className="text-sm mb-4">
              Access your saved job and course pathways for quick reference.
            </p>
            <button
              onClick={() => router.push("/bookmarks")}
              className="w-full bg-white text-purple-500 py-2 rounded-lg hover:bg-purple-50 transition"
            >
              View Bookmarks
            </button>
          </div>
  
          {/* Settings */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center mb-4">
              <SettingsIcon />
              <h3 className="text-xl font-semibold ml-3">Settings</h3>
            </div>
            <p className="text-sm mb-4">
              Manage your profile, notification preferences, and account.
            </p>
            <button
              onClick={() => router.push("/settings")}
              className="w-full bg-white text-yellow-500 py-2 rounded-lg hover:bg-yellow-50 transition"
            >
              Go to Settings
            </button>
          </div>
        </div>
  
        {/* Optional: Footer or other content */}
        <div className="mt-8 text-center text-gray-600">
          <p></p>
        </div>
      </div>
  
      {/* Updated SVG from undraw positioned at the right bottom */}
      <div className="absolute bottom-0 right-0 z-0 m-0 p-0">
        <img
          src="/undraw_dashboard_p93p.svg"
          alt="Dashboard SVG"
          className="h-[45vh] object-cover opacity-200"
        />
      </div>
    </div>
  );
  
  
}