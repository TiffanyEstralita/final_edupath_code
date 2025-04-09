import { NextResponse } from "next/server";
import { db } from "@/lib/db"; 

export async function POST(req: Request) {
	try {
		const { firebase_uid, name, educationLevel, fieldOfInterest } = await req.json();

		if (!firebase_uid) {
			return NextResponse.json({ success: false, error: "Missing firebase_uid" }, { status: 400 });
		}

		// Check if user profile exists
		const [rows] = await db.execute(
			`SELECT * FROM user_profiles WHERE firebase_uid = ?`,
			[firebase_uid]
		);

		if ((rows as any[]).length > 0) {
			// Update existing profile
			await db.execute(
				`UPDATE user_profiles SET name = ?, qualification = ?, interests = ? WHERE firebase_uid = ?`,
				[name, educationLevel, fieldOfInterest, firebase_uid]
			);
		} else {
			// Insert new profile
			await db.execute(
				`INSERT INTO user_profiles (firebase_uid, name, qualification, interests) VALUES (?, ?, ?, ?)`,
				[firebase_uid, name, educationLevel, fieldOfInterest]
			);
		}

		// Also update full_name in users table
		await db.execute(
			`UPDATE users SET full_name = ? WHERE firebase_uid = ?`,
			[name, firebase_uid]
		);

		return NextResponse.json({ success: true }); 
	} catch (error: any) {
		console.error("Profile update error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to update profile" },
			{ status: 500 }
		);
	}
}
