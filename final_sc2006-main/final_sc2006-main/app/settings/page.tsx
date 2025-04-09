"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut, deleteUser } from "firebase/auth";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    fieldOfInterest: "",
    educationLevel: "",
    profilePhoto: "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });

  // Check user authentication status
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
        try {
          // Fetch user profile data from your backend using Firebase UID
          const response = await fetch(`/api/user-profile?firebase_uid=${user.uid}`);
          const data = await response.json();

          if (response.ok) {
            setProfile({
              name: data.name || "", // Fallback to empty string if no data
              fieldOfInterest: data.interests || "",
              educationLevel: data.qualification || "",
              profilePhoto: data.profilePhoto || "",
            });
          } else {
            console.error("Failed to fetch user profile:", data.error);
            alert("Failed to fetch user profile");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          alert("An error occurred while fetching the profile data.");
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Handle input changes for profile fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  // Handle notification toggle changes
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [name]: checked,
    }));
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to update your profile.");
      return;
    }

    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebase_uid: user.uid,
          name: profile.name,
          educationLevel: profile.educationLevel,
          fieldOfInterest: profile.fieldOfInterest,
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert("Profile updated successfully.");
        router.push("/dashboard");
      } else {
        alert("Failed to update profile: " + result.error);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Something went wrong.");
    }
  };

  // Logout handler
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      alert("Logout failed: " + error.message);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("No user is logged in.");
      return;
    }

    try {
      // 1. Delete from your backend
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebase_uid: user.uid }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete user data.");
      }

      // 2. Delete from Firebase Authentication
      await deleteUser(user);

      alert("Account deleted successfully.");
      router.push("/");
    } catch (error: any) {
      console.error("Account deletion failed:", error.message);
      alert("Account deletion failed: " + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="relative container mx-auto px-8 sm:px-16 lg:px-24 py-6 z-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Settings</h2>

        {/* Profile Update Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Update Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="fieldOfInterest">Field of Interest</label>
              <select
                id="fieldOfInterest"
                name="fieldOfInterest"
                value={profile.fieldOfInterest}
                onChange={handleInputChange}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">{profile.fieldOfInterest || "Select your field of interest"}</option>
                <option value="Engineering">Engineering</option>
                <option value="Science">Science</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Technology">Technology</option>
                <option value="Arts">Arts</option>
                <option value="Finance">Finance</option>
                <option value="Law">Law</option>
                <option value="Infocomm">Infocomm</option>
                <option value="Accountancy">Accountancy</option>
                <option value="Media">Media</option>
                <option value="Architecture">Architecture</option>
                <option value="Pharmaceutical">Pharmaceutical</option>
                <option value="Culinary">Culinary</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Tourism">Tourism</option>
                <option value="Psychology">Psychology</option>
                <option value="Veterinary">Veterinary</option>
                <option value="Optometry">Optometry</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="educationLevel">Education Level</label>
              <select
                id="educationLevel"
                name="educationLevel"
                value={profile.educationLevel}
                onChange={handleInputChange}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">{profile.educationLevel || "Select your education level"}</option>
                <option value="Secondary School (O/N Levels)">Secondary School (O/N Levels)</option>
                <option value="Junior College (A Levels)">Junior College (A Levels)</option>
                <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                <option value="ITE Certificate">ITE Certificate</option>
                <option value="Nitec/Higher Nitec">Nitec/Higher Nitec</option>
                <option value="Private Diploma">Private Diploma</option>
                <option value="Bachelor Degree">Bachelor Degree</option>
                <option value="Postgraduate Diploma">Postgraduate Diploma</option>
                <option value="Master Degree">Master Degree</option>
                <option value="PhD">PhD</option>
              </select>

            </div>
          </div>
        </div>

        {/* Notification Preferences Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-700">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={notifications.emailNotifications}
                onChange={handleToggleChange}
                className="h-4 w-4 text-blue-500"
              />
              <label htmlFor="emailNotifications" className="ml-3 text-gray-600">Email Notifications</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smsNotifications"
                name="smsNotifications"
                checked={notifications.smsNotifications}
                onChange={handleToggleChange}
                className="h-4 w-4 text-blue-500"
              />
              <label htmlFor="smsNotifications" className="ml-3 text-gray-600">SMS Notifications</label>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col items-center space-y-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
            <button
              onClick={handleLogout}
              className="w-full sm:w-1/2 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full sm:w-1/2 bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-900 transition"
            >
              Delete Account
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full sm:w-1/2 bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="w-full sm:w-1/2 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* illustration */}
      <div className="absolute bottom-0 right-0 z-0">
        <img
          src="/undraw_settings_2quf.svg"
          alt="Settings SVG"
          className="h-[50vh] object-cover opacity-200"
        />
      </div>
    </div>
  );
}
