// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { uid, fullName, email } = body;

		if (!uid || !fullName || !email) {
			return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
		}

		// Check if user exists
		const [existing] = await db.execute('SELECT * FROM users WHERE firebase_uid = ?', [uid]);

		if ((existing as any[]).length === 0) {
			// Insert new user
			await db.execute(
				'INSERT INTO users (firebase_uid, full_name, email) VALUES (?, ?, ?)',
				[uid, fullName, email]
			);
		} else {
			// Update user
			await db.execute(
				'UPDATE users SET full_name = ?, email = ? WHERE firebase_uid = ?',
				[fullName, email, uid]
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Error saving user:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
