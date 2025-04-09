import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	try {
		const { firebase_uid, name, qualification, interests } = await req.json();

		const [rows] = await db.execute(
			"INSERT INTO user_profiles (firebase_uid, name, qualification, interests) VALUES (?, ?, ?, ?)",
			[firebase_uid, name, qualification, interests]);

		// Also insert the name into the users table
		await db.execute(
			`UPDATE users SET full_name = ? WHERE firebase_uid = ?`,
			[name, firebase_uid]
		  );

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error saving profile:", error);
		return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
	}
}
