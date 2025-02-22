"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (message: string, type: "success" | "error" | "info") => {
	if (toast.isActive("toast-container")) {
		toast.dismiss("toast-container");
	}
	if (toast.isActive("toast-container-2")) {
		toast.dismiss("toast-container-2");
	}
	if (toast.isActive("toast-container-3")) {
		toast.dismiss("toast-container-3");
	}
	switch (type) {
		case "success": {
			toast.success(message, {
				position: "top-center",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				toastId: `toast-container-${Math.random()}`
			});
			break;
		}
		case "error": {
			toast.error(message, {
				position: "top-center",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				toastId: `toast-container-${Math.random()}`
			});
			break;
		}
		case "info": {
			toast.info(message, {
				position: "top-center",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				toastId: `toast-container-${Math.random()}`
			});
			break;
		}
		default: {
			break;
		}
	}
};

const Home = () => {
	const [dinnerInput, setDinnerInput] = useState("");
	const [dinners, setDinners] = useState<Array<string>>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [generatedDinners, setGeneratedDinners] = useState<Array<string>>([]);
	const [isPoolCollapsed, setIsPoolCollapsed] = useState(false);
	const [numberDinnersToGenerate, setNumberDinnersToGenerate] = useState(3);
	const [allowDuplicates, setAllowDuplicates] = useState(false);
	const [showPreferences, setShowPreferences] = useState(false);

	// Toast notification limit
	const MAX_TOASTS = 3;

	const handleAddDinner = () => {
		if (!dinnerInput.trim()) {
			notify("Please enter a valid dinner name.", "error");
			return;
		}
		const lowerCaseDinners = dinners.map((dinner) => dinner.toLowerCase());
		if (lowerCaseDinners.includes(dinnerInput.toLowerCase())) {
			notify("This dinner is already in the list (case-insensitive).", "error");
			return;
		}
		setDinners([...dinners, dinnerInput]);
		setDinnerInput("");
		notify("Dinner added successfully!", "success");
	};

	const handleGenerateDinners = () => {
		if (dinners.length === 0) {
			notify("Please add some dinners first.", "error");
			return;
		}
		let availableDinners = [...dinners];
		if (!allowDuplicates) {
			availableDinners = availableDinners.filter(
				(dinner) => !generatedDinners.includes(dinner)
			);
		}
		if (availableDinners.length === 0) {
			notify("No unique dinners left to generate.", "error");
			return;
		}
		const shuffledDinners = [...availableDinners].sort(
			() => 0.5 - Math.random()
		);
		const selectedDinners = shuffledDinners.slice(0, numberDinnersToGenerate);
		setGeneratedDinners([...generatedDinners, ...selectedDinners]);
		notify(`Generated ${selectedDinners.length} dinners!`, "success");
	};

	const handleFormSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		handleAddDinner();
	};

	const handleDeleteDinner = (index: number) => {
		setDinners(dinners.filter((_, index_) => index_ !== index));
		notify("Dinner deleted successfully!", "success");
	};

	const handleDeleteGeneratedDinner = (index: number) => {
		setGeneratedDinners(
			generatedDinners.filter((_, index_) => index_ !== index)
		);
		notify("Generated dinner removed!", "success");
	};

	const handleClearAllGeneratedDinners = () => {
		if (
			window.confirm("Are you sure you want to clear all generated dinners?")
		) {
			setGeneratedDinners([]);
			notify("All generated dinners cleared!", "success");
		}
	};

	useEffect(() => {
		const savedDinners = localStorage.getItem("dinners");
		if (savedDinners) {
			setDinners(JSON.parse(savedDinners));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("dinners", JSON.stringify(dinners));
	}, [dinners]);

	// Filter dinners based on the search query
	const filteredDinners = dinners.filter((dinner) =>
		dinner.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-6">
			<div className="w-full max-w-2xl rounded-lg bg-gray-800 p-8 shadow-lg">
				<h1 className="mb-6 text-center text-4xl font-bold text-orange-400">
					My Dinners
				</h1>
				{/* Preferences Menu */}
				<div className="mb-4">
					<button
						className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-600"
						type="button"
						onClick={() => setShowPreferences(!showPreferences)}
					>
						{showPreferences ? "Hide Preferences" : "Show Preferences"}
					</button>
					{showPreferences && (
						<div className="mt-4 rounded-lg bg-gray-700 p-4">
							<div className="mb-4">
								<label className="block text-white">
									Number of Dinners to Generate:
								</label>
								<input
									className="mt-2 w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white"
									min={1}
									type="number"
									value={numberDinnersToGenerate}
									onChange={(event) =>
										setNumberDinnersToGenerate(
											Number.parseInt(event.target.value, 10)
										)
									}
								/>
							</div>
							<div className="flex items-center">
								<input
									checked={allowDuplicates}
									className="mr-2"
									type="checkbox"
									onChange={() => setAllowDuplicates(!allowDuplicates)}
								/>
								<label className="text-white">Allow Duplicates</label>
							</div>
						</div>
					)}
				</div>
				<form className="mb-6" onSubmit={handleFormSubmit}>
					<div className="flex flex-col space-y-4">
						<button
							className="w-full rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-transform duration-150 hover:bg-orange-700 active:scale-95"
							type="button"
							onClick={handleGenerateDinners}
						>
							Generate {numberDinnersToGenerate} Dinners
						</button>
						<div className="flex items-center space-x-2">
							<input
								className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
								placeholder="Add Dinner Name"
								type="text"
								value={dinnerInput}
								onChange={(event) => setDinnerInput(event.target.value)}
							/>
							<button
								className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition-transform duration-150 hover:bg-orange-700 active:scale-95"
								type="button"
								onClick={handleAddDinner}
							>
								<span className="text-2xl">+</span>
							</button>
						</div>
					</div>
				</form>
				{/* Search Bar */}
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
				{/* Collapsible Picking Pool */}
				<div className="mb-4">
					<button
						className="flex w-full items-center justify-between rounded-lg bg-gray-700 px-4 py-2 text-white"
						type="button"
						onClick={() => setIsPoolCollapsed(!isPoolCollapsed)}
					>
						<span>{dinners.length} dinners available</span>
						<span>{isPoolCollapsed ? "▼" : "▲"}</span>
					</button>
					{!isPoolCollapsed && (
						<div className="mt-2 h-96 overflow-y-auto rounded-lg border border-gray-700 bg-gray-700 p-4">
							<ul className="space-y-2">
								{filteredDinners.length === 0 ? (
									<p className="text-center text-gray-400">No dinners found.</p>
								) : (
									filteredDinners.map((dinner, index) => (
										<li
											className="flex items-center justify-between rounded-lg bg-gray-600 p-3 text-lg font-medium text-white shadow-sm"
											key={index}
										>
											<span>{dinner}</span>
											<button
												className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white transition-transform duration-150 hover:bg-red-700 active:scale-95"
												type="button"
												onClick={() => handleDeleteDinner(index)}
											>
												Delete
											</button>
										</li>
									))
								)}
							</ul>
						</div>
					)}
				</div>
				{/* Generated Dinners Section */}
				<div className="mb-4">
					<h2 className="mb-2 text-2xl font-bold text-orange-400">
						Generated Dinners
					</h2>
					<div className="flex flex-col space-y-2">
						<button
							className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-transform duration-150 hover:bg-red-700 active:scale-95"
							type="button"
							onClick={handleClearAllGeneratedDinners}
						>
							Clear All Generated Dinners
						</button>
					</div>
					<div className="mt-4 h-96 overflow-y-auto rounded-lg border border-gray-700 bg-gray-700 p-4">
						<ul className="space-y-2">
							{generatedDinners.length === 0 ? (
								<p className="text-center text-gray-400">
									No dinners generated yet.
								</p>
							) : (
								generatedDinners.map((dinner, index) => (
									<li
										className="flex items-center justify-between rounded-lg bg-gray-600 p-3 text-lg font-medium text-white shadow-sm"
										key={index}
									>
										<span>{dinner}</span>
										<button
											className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white transition-transform duration-150 hover:bg-red-700 active:scale-95"
											type="button"
											onClick={() => handleDeleteGeneratedDinner(index)}
										>
											Remove
										</button>
									</li>
								))
							)}
						</ul>
					</div>
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
		</main>
	);
};

export default Home;
