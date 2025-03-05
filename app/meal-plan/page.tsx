"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {
	breakfastNames,
	lunchNames,
	dinnerNames
} from "../utils/data/meal-names";

interface MealPlanDay {
	id: string;
	day: string;
	breakfast: string;
	lunch: string;
	dinner: string;
}

interface DinnerItem {
	id: string;
	name: string;
	date: string;
	isPinned: boolean;
}

const DAYS_OF_WEEK = [
	"Monday",
	"Sunday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];

const MealPlanPage = () => {
	const [mealPlan, setMealPlan] = useState<Array<MealPlanDay>>([]);
	const [numberOfDays, setNumberOfDays] = useState(3);
	const [savedMealPlans, setSavedMealPlans] = useState<
		Array<{ id: string; name: string }>
	>([]);
	const [planName, setPlanName] = useState("");
	const [userDinners, setUserDinners] = useState<Array<string>>([]);
	const [customBreakfasts, setCustomBreakfasts] = useState<Array<string>>([]);
	const [customLunches, setCustomLunches] = useState<Array<string>>([]);
	const [showSaveForm, setShowSaveForm] = useState(false);

	// Load user's dinners from localStorage
	useEffect(() => {
		try {
			// Load dinners
			const savedDinners = localStorage.getItem("dinners");
			if (savedDinners) {
				const parsed = JSON.parse(savedDinners);
				if (Array.isArray(parsed)) {
					if (typeof parsed[0] === "string") {
						setUserDinners(parsed);
					} else {
						setUserDinners(parsed.map((item: DinnerItem) => item.name));
					}
				}
			}

			// Load saved meal plans
			const savedPlans = localStorage.getItem("savedMealPlans");
			if (savedPlans) {
				setSavedMealPlans(JSON.parse(savedPlans));
			}

			// Load custom meal options (if you implement them later)
			const userBreakfasts = localStorage.getItem("customBreakfasts");
			if (userBreakfasts) {
				setCustomBreakfasts(JSON.parse(userBreakfasts));
			}

			const userLunches = localStorage.getItem("customLunches");
			if (userLunches) {
				setCustomLunches(JSON.parse(userLunches));
			}
		} catch (reason) {
			console.error("Error loading data:", reason);
		}
	}, []);

	// Generate a random meal plan
	const generateMealPlan = () => {
		const newPlan: Array<MealPlanDay> = [];

		// If user has no dinners in their collection, show a warning
		if (userDinners.length === 0) {
			toast.warning(
				"You don't have any dinners in your collection. Using default options.",
				{
					position: "top-center",
					autoClose: 4000
				}
			);
		}

		// Combine user's dinners with default dinners
		const availableDinners = [...new Set([...userDinners, ...dinnerNames])];

		// Combine any custom breakfasts/lunches with defaults
		const availableBreakfasts = [
			...new Set([...customBreakfasts, ...breakfastNames])
		];

		const availableLunches = [...new Set([...customLunches, ...lunchNames])];

		// Create a meal plan with random selections
		for (let index = 0; index < numberOfDays; index++) {
			// Get random meals
			const breakfast = getRandomItem(availableBreakfasts);
			const lunch = getRandomItem(availableLunches);
			const dinner = getRandomItem(availableDinners);

			newPlan.push({
				id: `meal-day-${index}-${Date.now()}`,
				day: DAYS_OF_WEEK[index % 7],
				breakfast,
				lunch,
				dinner
			});
		}

		setMealPlan(newPlan);
		toast.success(`Generated a ${numberOfDays}-day meal plan!`, {
			position: "top-center"
		});
	};

	// Helper to get a random item from array
	const getRandomItem = (items: Array<string>): string => {
		return items[Math.floor(Math.random() * items.length)];
	};

	// Save the current meal plan
	const saveMealPlan = () => {
		if (!planName.trim()) {
			toast.error("Please enter a name for your meal plan", {
				position: "top-center"
			});
			return;
		}

		const planId = `plan-${Date.now()}`;
		const newSavedPlan = {
			id: planId,
			name: planName
		};

		// Save the plan name to the list of saved plans
		const updatedSavedPlans = [...savedMealPlans, newSavedPlan];
		setSavedMealPlans(updatedSavedPlans);
		localStorage.setItem("savedMealPlans", JSON.stringify(updatedSavedPlans));

		// Save the actual meal plan content
		localStorage.setItem(`mealPlan-${planId}`, JSON.stringify(mealPlan));

		toast.success(`Saved meal plan: ${planName}`, {
			position: "top-center"
		});

		// Reset form
		setPlanName("");
		setShowSaveForm(false);
	};

	// Load a saved meal plan
	const loadMealPlan = (planId: string) => {
		try {
			const planData = localStorage.getItem(`mealPlan-${planId}`);
			if (planData) {
				const loadedPlan = JSON.parse(planData);
				setMealPlan(loadedPlan);
				setNumberOfDays(loadedPlan.length);

				const planName = savedMealPlans.find(
					(plan) => plan.id === planId
				)?.name;
				toast.info(`Loaded meal plan: ${planName}`, {
					position: "top-center"
				});
			}
		} catch (reason) {
			console.error("Error loading meal plan:", reason);
			toast.error("Could not load the selected meal plan", {
				position: "top-center"
			});
		}
	};

	// Delete a saved meal plan
	const deleteMealPlan = (planId: string, event: React.MouseEvent) => {
		event.stopPropagation(); // Prevent triggering the loadMealPlan

		try {
			// Remove from saved plans list
			const updatedPlans = savedMealPlans.filter((plan) => plan.id !== planId);
			setSavedMealPlans(updatedPlans);
			localStorage.setItem("savedMealPlans", JSON.stringify(updatedPlans));

			// Remove the actual plan data
			localStorage.removeItem(`mealPlan-${planId}`);

			toast.success("Meal plan deleted", {
				position: "top-center"
			});
		} catch (reason) {
			console.error("Error deleting meal plan:", reason);
			toast.error("Could not delete the meal plan", {
				position: "top-center"
			});
		}
	};

	// Regenerate a specific meal
	const regenerateMeal = (
		dayIndex: number,
		mealType: "breakfast" | "lunch" | "dinner"
	) => {
		const newPlan = [...mealPlan];

		let availableOptions: Array<string> = [];
		switch (mealType) {
			case "breakfast": {
				availableOptions = [...customBreakfasts, ...breakfastNames];
				break;
			}
			case "lunch": {
				availableOptions = [...customLunches, ...lunchNames];
				break;
			}
			case "dinner": {
				availableOptions = [...userDinners, ...dinnerNames];
				break;
			}
		}

		newPlan[dayIndex][mealType] = getRandomItem(availableOptions);
		setMealPlan(newPlan);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6">
			<div className="mx-auto w-full max-w-4xl rounded-xl bg-gray-800 p-4 shadow-xl sm:p-6">
				<h1 className="mb-6 text-center text-3xl font-bold text-orange-400 sm:text-4xl">
					Meal Plan Generator
				</h1>

				<div className="mb-6 flex justify-center space-x-4">
					<Link href="/home">
						<button
							className="rounded-lg bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-600"
							type="button"
						>
							← Back to Dinner List
						</button>
					</Link>
				</div>

				{/* Generation Controls */}
				<div className="mb-6 rounded-lg bg-gray-700 p-4">
					<div className="flex flex-col items-center gap-4 sm:flex-row">
						<div className="w-full sm:w-auto">
							<label className="mb-1 block text-sm text-gray-300">
								Number of Days:
							</label>
							<input
								className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white sm:w-24"
								max={7}
								min={1}
								type="number"
								value={numberOfDays}
								onChange={(event) =>
									setNumberOfDays(
										Math.min(
											7,
											Math.max(1, Number.parseInt(event.target.value) || 1)
										)
									)
								}
							/>
						</div>

						<button
							className="grow rounded-lg bg-orange-600 px-6 py-2 font-semibold text-white transition hover:bg-orange-700 sm:grow-0"
							type="button"
							onClick={generateMealPlan}
						>
							Generate Meal Plan
						</button>

						{mealPlan.length > 0 && !showSaveForm && (
							<button
								className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition hover:bg-teal-700"
								type="button"
								onClick={() => setShowSaveForm(true)}
							>
								Save This Plan
							</button>
						)}
					</div>

					{/* Save Plan Form */}
					{showSaveForm && (
						<div className="mt-4 border-t border-gray-600 pt-4">
							<div className="flex flex-col gap-3 sm:flex-row">
								<input
									className="grow rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white"
									placeholder="Enter a name for this meal plan"
									type="text"
									value={planName}
									onChange={(event) => setPlanName(event.target.value)}
								/>
								<button
									className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition hover:bg-teal-700"
									type="button"
									onClick={saveMealPlan}
								>
									Save
								</button>
								<button
									className="rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition hover:bg-gray-500"
									type="button"
									onClick={() => setShowSaveForm(false)}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
