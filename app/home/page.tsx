"use client";
import { useState } from "react";

const Home = () => {
	const [dinnerInput, setDinnerInput] = useState("");
	const [dinners, setDinners] = useState<Array<string>>([]);

	const handleAddDinner = () => {
		setDinners([...dinners, dinnerInput]);
		setDinnerInput("");
	};
	const handleFormSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		handleAddDinner();
	};
	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<h1 className="text-start text-3xl font-bold">My Dinners</h1>
			<div className="my-4 size-96 bg-black">
				<form
					className="flex flex-col items-center justify-between p-2"
					onSubmit={handleFormSubmit}
				>
					<button
						className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition-transform duration-150 hover:bg-blue-700 active:scale-90"
						type="button"
					>
						Generate Random Dinner
					</button>
					<div className="mt-4 flex w-full flex-row items-center justify-between">
						<input
							className="mr-2 w-full rounded px-4 py-2 text-black"
							placeholder="Add Dinner Name"
							type="text"
							value={dinnerInput}
							onChange={(event) => setDinnerInput(event.target.value)}
						/>
						<button
							className="rounded bg-blue-500 px-2 font-bold text-white transition-transform duration-150 hover:bg-blue-700 active:scale-90"
							type="button"
							onClick={handleAddDinner}
						>
							<span className="text-4xl">+</span>
						</button>
					</div>
				</form>
				<div className="flex h-96 w-full flex-col overflow-y-auto break-words rounded bg-white p-2 text-black">
					<ul className="w-full text-start text-2xl font-bold ">
						{dinners.map((dinner, index) => (
							<li key={index}>{dinner}</li>
						))}
					</ul>
				</div>
			</div>
		</main>
	);
};
export default Home;
