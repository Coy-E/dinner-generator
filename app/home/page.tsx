"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

import { dinnerNames } from "../utils/data/meal-names";
import StatsComponent from "../components/stats";

// Toast component configuration
const MAX_TOASTS = 3;

// Show notification toast
const notify = (message: string, type: "success" | "error" | "info") => {
	// Dismiss older toasts if the limit is reached
	if (toast.isActive("toast-container-1")) {
		toast.dismiss("toast-container-1");
	}
	if (toast.isActive("toast-container-2")) {
		toast.dismiss("toast-container-2");
	}
	if (toast.isActive("toast-container-3")) {
		toast.dismiss("toast-container-3");
	}

	// Show the new toast
	const toastId = `toast-container-${Math.random()}`;
	const toastOptions = {
		position: "top-center" as const,
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark" as const,
		toastId
	};

	switch (type) {
		case "success": {
			toast.success(message, toastOptions);
			break;
		}
		case "error": {
			toast.error(message, toastOptions);
			break;
		}
		case "info": {
			toast.info(message, toastOptions);
			break;
		}
		default: {
			break;
		}
	}
};

// Type definitions
interface DinnerItem {
	id: string;
	name: string;
	date: string;
	isPinned: boolean;
}

const Home = () => {
	// State management
	const [dinnerInput, setDinnerInput] = useState("");
	const [dinners, setDinners] = useState<Array<DinnerItem>>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [generatedDinners, setGeneratedDinners] = useState<Array<DinnerItem>>(
		[]
	);
	const [numberDinnersToGenerate, setNumberDinnersToGenerate] = useState(3);
	const [allowDuplicates, setAllowDuplicates] = useState(false);
	const [showPreferences, setShowPreferences] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [activeTab, setActiveTab] = useState<"pool" | "generated" | "stats">(
		"pool"
	);
	const [confirmationAction, setConfirmationAction] = useState<
		"clearGenerated" | "clearPool" | "deleteDinner" | null
	>(null);
	const [dinnerToDelete, setDinnerToDelete] = useState<string | null>(null);

	// Handle adding a new dinner to the pool
	const handleAddDinner = () => {
		if (!dinnerInput.trim()) {
			notify("Please enter a valid dinner name.", "error");
			return;
		}

		const lowerCaseDinners = dinners.map((dinner) => dinner.name.toLowerCase());
		if (lowerCaseDinners.includes(dinnerInput.toLowerCase())) {
			notify("This dinner is already in the list (case-insensitive).", "error");
			return;
		}

		const newDinner: DinnerItem = {
			id: `dinner-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
			name: dinnerInput,
			date: new Date().toISOString(),
			isPinned: false
		};

		setDinners([...dinners, newDinner]);
		setDinnerInput("");
		notify("Dinner added successfully!", "success");
	};

	// Generate random dinners
	const handleGenerateDinners = () => {
		if (dinners.length === 0) {
			notify("Please add some dinners first.", "error");
			return;
		}

		let availableDinners = [...dinners];

		if (!allowDuplicates) {
			const generatedDinnerNames = new Set(generatedDinners.map((d) => d.name));
			availableDinners = availableDinners.filter(
				(dinner) => !generatedDinnerNames.has(dinner.name)
			);
		}

		if (availableDinners.length === 0) {
			notify("No unique dinners left to generate.", "error");
			return;
		}

		// Shuffle available dinners
		const shuffledDinners = [...availableDinners].sort(
			() => 0.5 - Math.random()
		);

		// Select dinners (respecting the limit)
		const count = Math.min(numberDinnersToGenerate, shuffledDinners.length);
		const selectedDinners = shuffledDinners.slice(0, count);

		// Create generated dinner items
		const newGeneratedDinners = selectedDinners.map((dinner) => ({
			id: `generated-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
			name: dinner.name,
			date: new Date().toISOString(),
			isPinned: false
		}));

		setGeneratedDinners([...generatedDinners, ...newGeneratedDinners]);
		notify(`Generated ${newGeneratedDinners.length} dinners!`, "success");

		// Switch to the generated tab to show the results
		setActiveTab("generated");
	};

	{
		/* Stats Tab */
	}
	{
		activeTab === "stats" && <StatsComponent />;
	}

	// Handle form submission
	const handleFormSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		handleAddDinner();
	};

	// Handle dinner deletion from pool
	const handleDeleteDinner = (id: string) => {
		setDinnerToDelete(id);
		setConfirmationAction("deleteDinner");
		setShowConfirmation(true);
	};

	// Handle deleting a generated dinner
	const handleDeleteGeneratedDinner = (id: string) => {
		setGeneratedDinners(generatedDinners.filter((dinner) => dinner.id !== id));
		notify("Generated dinner removed!", "success");
	};

	// Pin/unpin a dinner
	const handleTogglePinDinner = (id: string, list: "pool" | "generated") => {
		if (list === "pool") {
			setDinners(
				dinners.map((dinner) =>
					dinner.id === id ? { ...dinner, isPinned: !dinner.isPinned } : dinner
				)
			);
		} else {
			setGeneratedDinners(
				generatedDinners.map((dinner) =>
					dinner.id === id ? { ...dinner, isPinned: !dinner.isPinned } : dinner
				)
			);
		}
	};

	// Clear all generated dinners
	const handleClearAllGeneratedDinners = () => {
		setConfirmationAction("clearGenerated");
		setShowConfirmation(true);
	};

	// Clear the entire dinner pool
	const handleClearAllDinners = () => {
		if (dinners.length === 0) {
			notify("Dinner pool is already empty.", "info");
			return;
		}
		setConfirmationAction("clearPool");
		setShowConfirmation(true);
	};

	// Confirm action callbacks
	const confirmAction = () => {
		switch (confirmationAction) {
			case "clearGenerated": {
				setGeneratedDinners([]);
				notify("All generated dinners cleared!", "success");
				break;
			}
			case "clearPool": {
				setDinners([]);
				notify("Dinner pool cleared!", "success");
				break;
			}
			case "deleteDinner": {
				if (dinnerToDelete) {
					setDinners(dinners.filter((dinner) => dinner.id !== dinnerToDelete));
					notify("Dinner deleted successfully!", "success");
				}
				break;
			}
		}
		setShowConfirmation(false);
		setConfirmationAction(null);
		setDinnerToDelete(null);
	};

	const cancelAction = () => {
		setShowConfirmation(false);
		setConfirmationAction(null);
		setDinnerToDelete(null);
	};

	// Add dinner from suggestion list
	const handleAddSuggestion = (suggestion: string) => {
		const lowerCaseDinners = dinners.map((dinner) => dinner.name.toLowerCase());
		if (lowerCaseDinners.includes(suggestion.toLowerCase())) {
			notify("This dinner is already in the list.", "error");
			return;
		}

		const newDinner: DinnerItem = {
			id: `dinner-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
			name: suggestion,
			date: new Date().toISOString(),
			isPinned: false
		};

		setDinners([...dinners, newDinner]);
		notify(`Added "${suggestion}" to your dinner pool!`, "success");
	};

	// Load saved dinners on component mount
	useEffect(() => {
		const savedDinners = localStorage.getItem("dinners");
		const savedGeneratedDinners = localStorage.getItem("generatedDinners");

		if (savedDinners) {
			try {
				// Handle both old format (string[]) and new format (DinnerItem[])
				const parsed = JSON.parse(savedDinners);
				if (Array.isArray(parsed)) {
					if (typeof parsed[0] === "string") {
						// Convert old format to new format
						setDinners(
							parsed.map((name) => ({
								id: `dinner-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
								name,
								date: new Date().toISOString(),
								isPinned: false
							}))
						);
					} else {
						setDinners(parsed);
					}
				}
			} catch (reason) {
				console.error("Error parsing saved dinners:", reason);
			}
		}

		if (savedGeneratedDinners) {
			try {
				setGeneratedDinners(JSON.parse(savedGeneratedDinners));
			} catch (reason) {
				console.error("Error parsing saved generated dinners:", reason);
			}
		}
	}, []);

	// Save dinners to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("dinners", JSON.stringify(dinners));
	}, [dinners]);

	// Save generated dinners to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("generatedDinners", JSON.stringify(generatedDinners));
	}, [generatedDinners]);

	// Filter dinners based on the search query
	const filteredDinners = dinners.filter((dinner) =>
		dinner.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Get suggestions based on meal type
	const getSuggestions = () => {
		// For now, we only have dinner suggestions
		return dinnerNames
			.filter(
				(name) =>
					!dinners.some(
						(dinner) => dinner.name.toLowerCase() === name.toLowerCase()
					)
			)
			.slice(0, 10);
	};

	// Render confirmation modal
	const renderConfirmationModal = () => {
		let title = "Are you sure?";
		let message = "This action cannot be undone.";

		switch (confirmationAction) {
			case "clearGenerated": {
				title = "Clear All Generated Dinners?";
				message =
					"This will remove all dinners from your generated list. This action cannot be undone.";
				break;
			}
			case "clearPool": {
				title = "Clear Entire Dinner Pool?";
				message =
					"This will remove all dinners from your pool. This action cannot be undone.";
				break;
			}
			case "deleteDinner": {
				title = "Delete Dinner?";
				const dinnerName = dinners.find((d) => d.id === dinnerToDelete)?.name;
				message = `Are you sure you want to delete "${dinnerName}" from your dinner pool?`;
				break;
			}
		}

		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
				<div className="w-full max-w-md rounded-xl bg-gray-800 p-6 shadow-2xl">
					<h2 className="mb-4 text-xl font-bold text-orange-400">{title}</h2>
					<p className="mb-6 text-white">{message}</p>
					<div className="flex justify-end space-x-4">
						<button
							className="rounded-lg bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
							type="button"
							onClick={cancelAction}
						>
							Cancel
						</button>
						<button
							className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
							type="button"
							onClick={confirmAction}
						>
							Confirm
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6">
			<div className="w-full max-w-3xl rounded-xl bg-gray-800 p-4 shadow-xl sm:p-6">
				<h1 className="mb-6 text-center text-3xl font-bold text-orange-400 sm:text-4xl">
					My Dinners
				</h1>

				{/* Main controls */}
				<div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
					<button
						className="flex h-12 items-center justify-center rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-all hover:bg-orange-700 active:scale-95"
						type="button"
						onClick={handleGenerateDinners}
					>
						Generate {numberDinnersToGenerate} Dinners
					</button>

					<button
						className="flex h-12 items-center justify-center rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white transition-all hover:bg-gray-600 active:scale-95"
						type="button"
						onClick={() => setShowPreferences(!showPreferences)}
					>
						{showPreferences ? "Hide Preferences" : "Show Preferences"}
					</button>
				</div>

				{/* Preferences Panel */}
				{showPreferences && (
					<div className="mb-6 rounded-lg bg-gray-700 p-4 shadow-inner">
						<h3 className="mb-3 font-semibold text-white">Preferences</h3>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label className="mb-1 block text-sm text-gray-200">
									Generate Count:
								</label>
								<input
									className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
									max={20}
									min={1}
									type="number"
									value={numberDinnersToGenerate}
									onChange={(event) =>
										setNumberDinnersToGenerate(
											Math.min(
												20,
												Math.max(
													1,
													Number.parseInt(event.target.value, 10) || 1
												)
											)
										)
									}
								/>
							</div>

							<div className="flex items-center">
								<label className="flex items-center text-sm text-gray-200">
									<input
										checked={allowDuplicates}
										className="mr-2 size-4 rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-orange-500"
										type="checkbox"
										onChange={() => setAllowDuplicates(!allowDuplicates)}
									/>
									Allow Duplicate Selections
								</label>
							</div>

							<div className="col-span-full mt-2">
								<button
									className="w-full rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-500"
									type="button"
									onClick={() => setShowSuggestions(!showSuggestions)}
								>
									{showSuggestions
										? "Hide Suggestions"
										: "Show Dinner Suggestions"}
								</button>
							</div>
						</div>

						{/* Dinner Suggestions */}
						{showSuggestions && (
							<div className="mt-4">
								<h4 className="mb-2 text-sm font-medium text-gray-200">
									Quick Add:
								</h4>
								<div className="flex flex-wrap gap-2">
									{getSuggestions().map((suggestion) => (
										<button
											className="rounded-full bg-gray-600 px-3 py-1 text-xs text-white transition hover:bg-orange-600"
											key={suggestion}
											type="button"
											onClick={() => handleAddSuggestion(suggestion)}
										>
											+ {suggestion}
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Add Dinner Form */}
				<form className="mb-6" onSubmit={handleFormSubmit}>
					<div className="flex items-center space-x-2">
						<input
							className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
							placeholder="Add Dinner Name"
							type="text"
							value={dinnerInput}
							onChange={(event) => setDinnerInput(event.target.value)}
						/>
						<button
							className="rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white transition-transform duration-150 hover:bg-orange-700 active:scale-95"
							type="submit"
						>
							<span className="text-xl">+</span>
						</button>
					</div>
				</form>

				{/* Navigation links */}
				<div className="mb-6 flex justify-between">
					<div className="flex space-x-3">
						<Link href="/wheel">
							<button
								className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
								type="button"
							>
								Spin Wheel
							</button>
						</Link>
						<Link href="/meal-plan">
							<button
								className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
								type="button"
							>
								Meal Plans
							</button>
						</Link>
					</div>
				</div>

				{/* Tabs */}
				<div className="mb-4 flex border-b border-gray-700">
					<button
						type="button"
						className={`mr-2 px-4 py-2 font-medium ${
							activeTab === "pool"
								? "border-b-2 border-orange-500 text-orange-400"
								: "text-gray-400 hover:text-white"
						}`}
						onClick={() => setActiveTab("pool")}
					>
						Dinner Pool ({dinners.length})
					</button>
					<button
						type="button"
						className={`mr-2 px-4 py-2 font-medium ${
							activeTab === "generated"
								? "border-b-2 border-orange-500 text-orange-400"
								: "text-gray-400 hover:text-white"
						}`}
						onClick={() => setActiveTab("generated")}
					>
						Generated ({generatedDinners.length})
					</button>
					<button
						type="button"
						className={`px-4 py-2 font-medium ${
							activeTab === "stats"
								? "border-b-2 border-orange-500 text-orange-400"
								: "text-gray-400 hover:text-white"
						}`}
						onClick={() => setActiveTab("stats")}
					>
						Stats
					</button>
				</div>

				{/* Search Bar - Only show for dinner pool */}
				{activeTab === "pool" && (
					<div className="mb-4 flex items-center space-x-2">
						<input
							className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
							placeholder="Search for a dinner..."
							type="text"
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
						/>
						{searchQuery && (
							<button
								className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 hover:bg-gray-700 active:scale-95"
								type="button"
								onClick={() => setSearchQuery("")}
							>
								Clear
							</button>
						)}
					</div>
				)}

				{/* Action buttons for the active tab */}
				<div className="mb-4">
					{activeTab === "pool" && (
						<button
							className="w-full rounded-lg bg-red-600/80 px-4 py-2 font-medium text-white transition hover:bg-red-700"
							disabled={dinners.length === 0}
							type="button"
							onClick={handleClearAllDinners}
						>
							Clear Entire Dinner Pool
						</button>
					)}

					{activeTab === "generated" && (
						<button
							className="w-full rounded-lg bg-red-600/80 px-4 py-2 font-medium text-white transition hover:bg-red-700"
							disabled={generatedDinners.length === 0}
							type="button"
							onClick={handleClearAllGeneratedDinners}
						>
							Clear All Generated Dinners
						</button>
					)}
				</div>

				{/* Dinner Lists */}
				<div className="h-96 overflow-y-auto rounded-lg border border-gray-700 bg-gray-700 p-3 shadow-inner">
					{/* Dinner Pool Tab */}
					{activeTab === "pool" && (
						<>
							{filteredDinners.length === 0 ? (
								<div className="flex h-full flex-col items-center justify-center text-center">
									<p className="text-gray-400">
										{dinners.length === 0
											? "No dinners in your pool yet. Add some above!"
											: "No dinners match your search."}
									</p>
									{dinners.length === 0 && (
										<button
											className="mt-4 rounded-lg bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500"
											type="button"
											onClick={() => {
												setShowSuggestions(true);
												setShowPreferences(true);
											}}
										>
											Show Suggestions
										</button>
									)}
								</div>
							) : (
								<ul className="space-y-2">
									{filteredDinners.map((dinner) => (
										<li
											className="flex items-center justify-between rounded-lg bg-gray-800 p-3 shadow-sm transition hover:bg-gray-700"
											key={dinner.id}
										>
											<div className="flex items-center">
												<button
													title={dinner.isPinned ? "Unpin" : "Pin"}
													type="button"
													className={`mr-2 text-lg ${
														dinner.isPinned
															? "text-yellow-500"
															: "text-gray-500"
													}`}
													onClick={() =>
														handleTogglePinDinner(dinner.id, "pool")
													}
												>
													{dinner.isPinned ? "★" : "☆"}
												</button>
												<span className="text-lg font-medium text-white">
													{dinner.name}
												</span>
											</div>
											<button
												className="rounded-lg bg-red-600/80 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700"
												type="button"
												onClick={() => handleDeleteDinner(dinner.id)}
											>
												Delete
											</button>
										</li>
									))}
								</ul>
							)}
						</>
					)}

					{/* Generated Dinners Tab */}
					{activeTab === "generated" && (
						<>
							{generatedDinners.length === 0 ? (
								<div className="flex h-full flex-col items-center justify-center text-center">
									<p className="text-gray-400">No dinners generated yet.</p>
									<button
										className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm text-white hover:bg-orange-700"
										type="button"
										onClick={handleGenerateDinners}
									>
										Generate Dinners
									</button>
								</div>
							) : (
								<ul className="space-y-2">
									{generatedDinners.map((dinner) => (
										<li
											className="flex items-center justify-between rounded-lg bg-gray-800 p-3 shadow-sm transition hover:bg-gray-700"
											key={dinner.id}
										>
											<div className="flex items-center">
												<button
													title={dinner.isPinned ? "Unpin" : "Pin"}
													type="button"
													className={`mr-2 text-lg ${
														dinner.isPinned
															? "text-yellow-500"
															: "text-gray-500"
													}`}
													onClick={() =>
														handleTogglePinDinner(dinner.id, "generated")
													}
												>
													{dinner.isPinned ? "★" : "☆"}
												</button>
												<span className="text-lg font-medium text-white">
													{dinner.name}
												</span>
											</div>
											<button
												className="rounded-lg bg-red-600/80 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-700"
												type="button"
												onClick={() => handleDeleteGeneratedDinner(dinner.id)}
											>
												Remove
											</button>
										</li>
									))}
								</ul>
							)}
						</>
					)}
				</div>
			</div>

			{/* Toast Container */}
			<ToastContainer
				closeOnClick
				draggable
				pauseOnHover
				aria-label="toast-container"
				autoClose={3000}
				limit={MAX_TOASTS}
				theme="dark"
			/>

			{/* Confirmation Modal */}
			{showConfirmation && renderConfirmationModal()}
		</main>
	);
};

export default Home;
