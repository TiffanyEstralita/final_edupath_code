"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from '@/lib/firebase';

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [interests, setInterests] = useState("");
  const router = useRouter();

  const qualifications = [
    "Secondary School (O/N Levels)",
    "Junior College (A Levels)",
    "Polytechnic Diploma",
    "ITE Certificate",
    "Nitec/Higher Nitec",
    "Private Diploma",
    "Bachelor Degree",
    "Postgraduate Diploma",
    "Master Degree",
    "PhD",
  ];

  const interestOptions = [
    "Engineering",
    "Science",
    "Design",
    "Business",
    "Technology",
    "Arts",
    "Finance",
    "Law",
    "Infocomm",
    "Accountancy",
    "Media",
    "Architecture",
    "Pharmaceutical",
    "Culinary",
    "Hospitality",
    "Tourism",
    "Psychology",
    "Veterinary",
    "Optometry",
    "Management"
  ];

  const isFormValid = name && qualification && interests;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("All fields are required!");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("User not authenticated");
        return;
      }

      const response = await fetch("/api/save-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebase_uid: user.uid,
          name,
          qualification,
          interests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Profile saved:", data);
        router.push("/dashboard");
      } else {
        console.error("Failed to save profile:", data.error);
        alert("Failed to save profile.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the profile.");
    }

    const fetchRecommendations = async (firebaseUid: string) => {
      const res = await fetch("/api/recommend_programs.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ firebase_uid: firebaseUid })
      });

      const data = await res.json();
      return data;
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Fill Your Profile
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Education</label>
            <select
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Select Qualification</option>
              {qualifications.map((qual) => (
                <option key={qual} value={qual}>
                  {qual}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Interests</label>
            <select
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Select Interest</option>
              {interestOptions.map((interest) => (
                <option key={interest} value={interest}>
                  {interest}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full ${isFormValid ? 'bg-blue-500' : 'bg-gray-400'} text-white py-2 rounded-lg hover:bg-blue-600 transition`}
            disabled={!isFormValid}
          >
            Save Profile
          </button>
        </form>

        <div className="flex justify-center mt-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8 text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v18m9-9H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
