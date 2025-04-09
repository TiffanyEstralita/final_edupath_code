// app/api/delete-account/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	try {
		const { firebase_uid } = await req.json();

		if (!firebase_uid) {
			return NextResponse.json({ error: "Missing UID" }, { status: 400 });
		}

		await db.execute("DELETE FROM user_profiles WHERE firebase_uid = ?", [firebase_uid]);
		await db.execute("DELETE FROM users WHERE firebase_uid = ?", [firebase_uid]);

		return NextResponse.json({ message: "Account data deleted" });
	} catch (error) {
		console.error("Error deleting account:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
