'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type Course = {
  course_name: string;
  institution: string;
  category: string;
  link?: string;
  id?: string;
};

export default function RecommendationsPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterProgramType, setFilterProgramType] = useState<'all' | 'degree' | 'diploma'>('all');
  const [filterInstitution, setFilterInstitution] = useState('all');

  useEffect(() => {
    const fetchRecommendations = async () => {
      const user = auth.currentUser;

      if (!user) return;

      const res = await fetch('/api/get-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebase_uid: user.uid }),
      });

      const data = await res.json();
      setCourses(data.recommendations || []);
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  const handleBookmark = async (course: Course) => {
    const user = auth.currentUser;

    if (!user) {
      alert('Please log in to bookmark courses.');
      return;
    }

    const courseToSave = {
      title: course.course_name || 'Untitled Course',
      description: course.institution || course.category || 'No description',
      link: course.link || `/course-details/${course.id || course.course_name}`, // fallback slug
    };

    const res = await fetch('/api/save-bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebase_uid: user.uid,
        course: courseToSave,
      }),
    });

    const result = await res.json();
    if (result.success) {
      alert('Course bookmarked!');
    } else {
      alert('Failed to bookmark course.');
    }
  };

  // Extract unique institutions
  const institutions = Array.from(new Set(courses.map((c) => c.institution).filter(Boolean))).sort();

  // Apply filters
  const filteredCourses = courses.filter((course) => {
    const name = course.course_name?.toLowerCase() || '';
    const institution = course.institution || '';

    const matchesType =
      filterProgramType === 'all' ||
      (filterProgramType === 'degree' && (name.includes('bachelor') || name.includes('degree'))) ||
      (filterProgramType === 'diploma' && name.includes('diploma'));

    const matchesInstitution = filterInstitution === 'all' || institution === filterInstitution;

    return matchesType && matchesInstitution;
  });

  return (
    <div className="min-h-screen bg-white p-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">Recommended Courses</h1>
        <p className="text-center text-gray-600 mb-8">
          Based on your interests, here are some courses you might like.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {/* Program Type Buttons */}
          <div className="flex gap-2">
            {['all', 'degree', 'diploma'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterProgramType(type as any)}
                className={`px-4 py-2 rounded ${filterProgramType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-blue-300 text-blue-600'
                  } transition`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Institution Dropdown */}
          <div>
            <select
              value={filterInstitution}
              onChange={(e) => setFilterInstitution(e.target.value)}
              className="border border-blue-300 text-blue-700 px-4 py-2 rounded"
            >
              <option value="all">All Institutions</option>
              {institutions.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading recommendations...</p>
        ) : filteredCourses.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, i) => (
              <li key={i} className="border p-4 rounded-lg shadow hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-blue-800">{course.course_name}</h2>
                <p className="text-sm text-gray-600">{course.institution}</p>
                <p className="text-sm text-gray-500 mb-2">{course.category}</p>
                <button
                  onClick={() => handleBookmark(course)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition text-sm"
                >
                  Bookmark
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 italic">No courses match your selected filters.</p>
        )}

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}