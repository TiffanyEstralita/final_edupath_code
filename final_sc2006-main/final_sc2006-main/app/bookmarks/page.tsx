'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

type Bookmark = {
  title: string;
  description: string;
  link: string;
};

const SavedPathwaysPage = () => {
  const router = useRouter();
  const [savedItems, setSavedItems] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const res = await fetch('/api/get-bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebase_uid: user.uid }),
      });

      const data = await res.json();
      setSavedItems(data.bookmarks || []);
      setLoading(false);
    };

    fetchBookmarks();
  }, []);

  const handleUnsave = async (course: Bookmark) => {
    const user = auth.currentUser;

    if (!user) return;

    const res = await fetch('/api/delete-bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebase_uid: user.uid, course }),
    });

    const data = await res.json();

    if (data.success) {
      // Remove the unsaved course from the state
      setSavedItems(savedItems.filter(item => item.link !== course.link));
    } else {
      console.error('Failed to unsave the bookmark');
    }
  };


  return (
    <div className="min-h-screen bg-white pt-12 pb-48 relative">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Saved Pathways
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Access your saved job and course pathways for quick reference
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading bookmarks...</p>
        ) : savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {savedItems.map((item, index) => (
              <div
                key={index}
                className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <p className="text-sm text-gray-400">This is a saved course recommendation.</p>

                <button
                  onClick={() => handleUnsave(item)}
                  className="mt-4 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
                >
                  Unsave
                </button>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic mb-12">
            You haven't saved any pathways yet.
          </p>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 mb-4 mr-4">
        <img
          src="/undraw_thought-process_pavs.svg"
          alt="Saved Pathway"
          className="h-auto w-40 sm:w-48 md:w-64 lg:w-120"
        />
      </div>
    </div>
  );
};

export default SavedPathwaysPage;