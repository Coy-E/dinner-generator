"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import DinnerWheel from "../components/dinner-wheel";

const WheelPage = () => {
	const [dinners, setDinners] = useState<Array<string>>([]);
	const [generatedDinners, setGeneratedDinners] = useState<Array<string>>([]);
	const [selectedDinner, setSelectedDinner] = useState<string | null>(null);

	useEffect(() => {
		// Load dinners from localStorage
		try {
			const savedDinners = localStorage.getItem("dinners");
			if (savedDinners) {
				const parsed = JSON.parse(savedDinners);
				if (Array.isArray(parsed)) {
					// Handle both old format (string[]) and new format (with IDs)
					if (typeof parsed[0] === "string") {
						setDinners(parsed);
					} else {
						// Extract dinner names from object structure
						setDinners(
							parsed.map(
								(item: { name?: string }) => item.name || (item as string)
							)
						);
					}
				}
			}

			const savedGeneratedDinners = localStorage.getItem("generatedDinners");
			if (savedGeneratedDinners) {
				const parsed = JSON.parse(savedGeneratedDinners);
				if (Array.isArray(parsed)) {
					if (typeof parsed[0] === "string") {
						setGeneratedDinners(parsed);
					} else {
						setGeneratedDinners(
							parsed.map(
								(item: { name?: string }) => item.name || (item as string)
							)
						);
					}
				}
			}
		} catch (reason) {
			console.error("Error loading dinners:", reason);
		}
	}, []);

	const handleDinnerSelected = (dinner: string) => {
		setSelectedDinner(dinner);

		// Add to generated dinners if it doesn't already exist
		if (!generatedDinners.includes(dinner)) {
			const newGeneratedDinners = [...generatedDinners, dinner];
			setGeneratedDinners(newGeneratedDinners);

			// Save to localStorage - we're just adding the name, not the full object structure
			try {
				const existingGenerated = localStorage.getItem("generatedDinners");
				if (existingGenerated) {
					const parsed = JSON.parse(existingGenerated);
					if (Array.isArray(parsed)) {
						// If the existing format uses objects with IDs
						if (parsed.length > 0 && typeof parsed[0] === "object") {
							const newDinner = {
								id: `generated-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
								name: dinner,
								date: new Date().toISOString(),
								isPinned: false
							};
							localStorage.setItem(
								"generatedDinners",
								JSON.stringify([...parsed, newDinner])
							);
						} else {
							// Old format - just strings
							localStorage.setItem(
								"generatedDinners",
								JSON.stringify(newGeneratedDinners)
							);
						}
					}
				}
			} catch (reason) {
				console.error("Error saving generated dinner:", reason);
			}
		}

		toast.success(`${dinner} has been selected!`, {
			position: "top-center",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark"
		});
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6">
			<div className="w-full max-w-3xl rounded-xl bg-gray-800 p-4 shadow-xl sm:p-6">
				<h1 className="mb-6 text-center text-3xl font-bold text-orange-400 sm:text-4xl">
					Dinner Wheel
				</h1>

				<div className="mb-6 flex justify-center">
					<Link href="/home">
						<button
							className="rounded-lg bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-600"
							type="button"
						>
							← Back to Dinner List
						</button>
					</Link>
				</div>

				<div className="flex flex-col items-center justify-center">
					<div className="mb-6 w-full max-w-md">
						<DinnerWheel
							items={dinners}
							colorScheme={[
								"#FF6B6B",
								"#4ECDC4",
								"#FFD166",
								"#06D6A0",
								"#118AB2",
								"#F78C6B"
							]}
							onSelect={handleDinnerSelected}
						/>
					</div>

					{dinners.length === 0 && (
						<div className="my-4 rounded-lg bg-gray-700 p-6 text-center">
							<p className="mb-4 text-gray-300">
								You need to add some dinners first!
							</p>
							<Link href="/home">
								<button
									className="rounded-lg bg-orange-600 px-4 py-2 text-white transition hover:bg-orange-700"
									type="button"
								>
									Go Add Some Dinners
								</button>
							</Link>
						</div>
					)}

					{selectedDinner && (
						<div className="mt-8 w-full max-w-md rounded-lg bg-gray-700 p-6 text-center">
							<h2 className="mb-2 text-xl text-gray-300">
								Tonight&apos;s Dinner:
							</h2>
							<p className="text-3xl font-bold text-orange-400">
								{selectedDinner}
							</p>
						</div>
					)}
				</div>
			</div>

			<ToastContainer
				closeOnClick
				draggable
				pauseOnHover
				aria-label="Notification"
				autoClose={3000}
				theme="dark"
			/>
		</main>
	);
};

export default WheelPage;
