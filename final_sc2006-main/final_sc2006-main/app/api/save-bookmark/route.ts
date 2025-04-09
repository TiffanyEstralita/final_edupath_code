// POST /api/save-bookmark
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	const { firebase_uid, course } = await req.json();

	try {
		await db.execute(
			`INSERT INTO bookmarks (firebase_uid, course_data) VALUES (?, ?)`,
			[firebase_uid, JSON.stringify(course)]
		);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Bookmark error:", error);
		return NextResponse.json({ error: "Failed to bookmark" }, { status: 500 });
	}
}
