import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import rawPrograms from "@/public/programs.json";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const firebase_uid = body.firebase_uid;

		if (!firebase_uid) {
			return NextResponse.json({ error: "Firebase UID is required" }, { status: 400 });
		}

		// Fetch user profile from MySQL
		const [rows]: any = await db.execute(
			"SELECT interests FROM user_profiles WHERE firebase_uid = ?",
			[firebase_uid]
		);

		if (!rows || rows.length === 0) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		const userInterest = rows[0].interests;

		// Split comma-separated interests (e.g., "Design, Tech")
		const interestList = userInterest
			.split(',')
			.map((i: string) => i.trim().toLowerCase());

		// Normalize program data
		const normalizedPrograms = rawPrograms.map((course: any) => {
			// Normalize mode_of_study to consistent 'Full-Time' or 'Part-Time'
			const rawMode = (course.mode_of_study || '').toLowerCase().trim();
			let normalizedMode = 'Full-Time';
			if (rawMode.includes('part') || rawMode.includes('online') || rawMode.includes('distance')) {
				normalizedMode = 'Part-Time';
			} else if (rawMode.includes('full') || rawMode.includes('on-campus')) {
				normalizedMode = 'Full-Time';
			}

			return {
				course_name: course.course_name,
				institution: course.institution,
				category: course.category || '',
				link: course.link || '',
				id: course.id || '',
				mode: normalizedMode,
			};
		});

		// Filter programs based on user's interests
		const recommendedCourses = normalizedPrograms.filter((course: any) =>
			interestList.some((interest: string) =>
				course.course_name.toLowerCase().includes(interest) ||
				course.category.toLowerCase().includes(interest)
			)
		);

		return NextResponse.json({ recommendations: recommendedCourses });

	} catch (error) {
		console.error("Recommendation error:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}