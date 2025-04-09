//to fetch the user profile to display it in setting/page.tsx

// app/api/user-profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const firebase_uid = url.searchParams.get('firebase_uid');

    if (!firebase_uid) {
      return NextResponse.json({ error: 'Missing firebase_uid' }, { status: 400 });
    }

    // Fetch the user profile using the firebase_uid
    const [rows] = await db.execute(
      'SELECT * FROM user_profiles WHERE firebase_uid = ?',
      [firebase_uid]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Return the profile data
    const userProfile = (rows as any[])[0]; // assuming it's only one result

    return NextResponse.json({
      name: userProfile.name,
      qualification: userProfile.qualification,
      interests: userProfile.interests,
      profilePhoto: userProfile.profile_photo || '', // add profile photo field if needed
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
