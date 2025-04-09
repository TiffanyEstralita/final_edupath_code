// GET /api/get-bookmarks
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	const { firebase_uid } = await req.json();

	try {
		const [rows]: any = await db.execute(
			`SELECT course_data FROM bookmarks WHERE firebase_uid = ?`,
			[firebase_uid]
		);
		const bookmarks = rows.map((row: any) =>
			typeof row.course_data === "string"
				? JSON.parse(row.course_data)
				: row.course_data
		);

		return NextResponse.json({ bookmarks });
	} catch (error) {
		console.error("Fetch bookmarks error:", error);
		return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
	}
}
