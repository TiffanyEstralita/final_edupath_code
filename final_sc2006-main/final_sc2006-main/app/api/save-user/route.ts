import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	try {
		const { uid, email } = await req.json();

		const [rows] = await db.execute(
			"INSERT INTO users (firebase_uid, email) VALUES (?, ?)",
			[uid, email]
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error saving user:", error);
		return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
	}
}
