import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { firebase_uid, course } = await req.json();

    if (!firebase_uid || !course) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Remove the bookmark from the database
    await db.execute(
      'DELETE FROM bookmarks WHERE firebase_uid = ? AND course_data = ?',
      [firebase_uid, JSON.stringify(course)]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}
