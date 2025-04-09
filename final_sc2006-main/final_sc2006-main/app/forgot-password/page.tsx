"use client";
import { useState } from "react";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from '@/lib/firebase';

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);
	const [isSending, setIsSending] = useState(false);

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");
		setIsSending(true);
		try {
			await sendPasswordResetEmail(auth, email);
			setIsSuccess(true);
			setMessage("✅ Password reset email sent! Check your inbox.");
		} catch (error: any) {
			setIsSuccess(false);
			setMessage(error.message || "Something went wrong.");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
			<div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
				<h1 className="text-2xl font-bold mb-4 text-center text-black">
					Reset Password
				</h1>
				<form onSubmit={handleReset} className="space-y-4">
					<input
						type="email"
						className="w-full border border-gray-300 p-3 rounded text-black"
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<button
						type="submit"
						disabled={isSending}
						className={`w-full py-3 rounded transition text-white ${isSending
							? "bg-blue-300 cursor-not-allowed"
							: "bg-blue-600 hover:bg-blue-700"
							}`}
					>
						{isSending ? "Sending..." : "Send Reset Email"}
					</button>
				</form>

				{message && (
					<p
						className={`text-sm text-center mt-4 ${isSuccess ? "text-green-600" : "text-red-500"
							}`}
					>
						{message}
					</p>
				)}

				<p
					onClick={() => router.push("/login")}
					className="text-sm text-blue-600 mt-4 text-center cursor-pointer hover:underline"
				>
					Back to Login
				</p>
			</div>

			{/* Background SVG image */}
			<div className="absolute bottom-0 right-0 mb-4 mr-4 z-0">
				<img
					src="/forgotpassword.svg"
					alt="Forgot Password"
					className="h-auto w-40 md:w-84"
				/>
			</div>

		</main>
	);
}