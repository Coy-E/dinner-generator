"use client";
import { useState } from "react";

const Home = () => {
	const [dinnerInput, setDinnerInput] = useState("");
	const [dinners, setDinners] = useState<Array<string>>([]);

	const handleAddDinner = () => {
		if (!dinnerInput.trim()) {
			alert("Please enter a valid dinner name.");
			return;
		}
		if (dinners.includes(dinnerInput)) {
			alert("This dinner is already in the list.");
			return;
		}
		setDinners([...dinners, dinnerInput]);
		setDinnerInput("");
	};
	const handleGenerateRandomDinner = () => {
		if (dinners.length === 0) {
			alert("Please add some dinners first.");
			return;
		}
		const randomIndex = Math.floor(Math.random() * dinners.length);
		alert(`Tonight's dinner: ${dinners[randomIndex]}`);
	};
	const handleFormSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		handleAddDinner();
	};
	const handleDeleteDinner = (index: number) => {
		setDinners(dinners.filter((_, index_) => index_ !== index));
	};
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
			<div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
				<h1 className="mb-6 text-center text-4xl font-bold text-gray-800">
					My Dinners
				</h1>
				<form className="mb-6" onSubmit={handleFormSubmit}>
					<div className="flex flex-col space-y-4">
						<button
							className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-transform duration-150 hover:bg-blue-700 active:scale-95"
							type="button"
							onClick={handleGenerateRandomDinner}
						>
							Generate Random Dinner
						</button>
						<div className="flex items-center space-x-2">
							<input
								className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
								placeholder="Add Dinner Name"
								type="text"
								value={dinnerInput}
								onChange={(event) => setDinnerInput(event.target.value)}
							/>
							<button
								className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-transform duration-150 hover:bg-blue-700 active:scale-95"
								type="button"
								onClick={handleAddDinner}
							>
								<span className="text-2xl">+</span>
							</button>
						</div>
					</div>
				</form>
				<div className="h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
					<ul className="space-y-2">
						{dinners.map((dinner, index) => (
							<li
								className="flex items-center justify-between rounded-lg bg-white p-3 text-lg font-medium text-gray-700 shadow-sm"
								key={index}
							>
								<span>{dinner}</span>
								<button
									className="rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold text-white transition-transform duration-150 hover:bg-red-600 active:scale-95"
									type="button"
									onClick={() => handleDeleteDinner(index)}
								>
									Delete
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</main>
	);
};

export default Home;
