"use client";
import { useState, useEffect } from "react";
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts";

interface DinnerItem {
	id: string;
	name: string;
	date: string;
	isPinned: boolean;
}

interface Stats {
	totalDinners: number;
	totalGenerated: number;
	topGenerated: Array<{ name: string; count: number }>;
	generationHistory: Array<{ date: string; count: number }>;
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2"];

const StatsComponent = () => {
	const [stats, setStats] = useState<Stats>({
		totalDinners: 0,
		totalGenerated: 0,
		topGenerated: [],
		generationHistory: []
	});

	const [chartType, setChartType] = useState<"pie" | "bar">("pie");

	useEffect(() => {
		calculateStats();
	}, []);

	const calculateStats = () => {
		try {
			// Get dinners
			const dinnersString = localStorage.getItem("dinners");
			let dinners: Array<DinnerItem> = [];

			if (dinnersString) {
				const parsedDinners = JSON.parse(dinnersString);
				if (Array.isArray(parsedDinners)) {
					// Handle both old format (string[]) and new format (DinnerItem[])
					dinners =
						typeof parsedDinners[0] === "string"
							? parsedDinners.map((name) => ({
									id: `dinner-${Math.random().toString(36).slice(2, 11)}`,
									name,
									date: new Date().toISOString(),
									isPinned: false
								}))
							: parsedDinners;
				}
			}

			// Get generated dinners
			const generatedString = localStorage.getItem("generatedDinners");
			let generated: Array<DinnerItem> = [];

			if (generatedString) {
				const parsedGenerated = JSON.parse(generatedString);
				if (Array.isArray(parsedGenerated)) {
					generated =
						typeof parsedGenerated[0] === "string"
							? parsedGenerated.map((name) => ({
									id: `generated-${Math.random().toString(36).slice(2, 11)}`,
									name,
									date: new Date().toISOString(),
									isPinned: false
								}))
							: parsedGenerated;
				}
			}

			// Count occurrences of each dinner
			const counts: Record<string, number> = {};
			for (const dinner of generated) {
				counts[dinner.name] = (counts[dinner.name] || 0) + 1;
			}

			// Sort by count and take top 5
			const topGenerated = Object.entries(counts)
				.map(([name, count]) => ({ name, count }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 5);

			// Group generations by date
			const dateGroups: Record<string, number> = {};
			for (const dinner of generated) {
				const date = new Date(dinner.date).toLocaleDateString();
				dateGroups[date] = (dateGroups[date] || 0) + 1;
			}

			// Convert to array and sort by date
			const generationHistory = Object.entries(dateGroups)
				.map(([date, count]) => ({ date, count }))
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
				.slice(-7); // Last 7 days

			setStats({
				totalDinners: dinners.length,
				totalGenerated: generated.length,
				topGenerated,
				generationHistory
			});
		} catch (reason) {
			console.error("Error calculating stats:", reason);
		}
	};

	return (
		<div className="rounded-lg bg-gray-700 p-4 shadow-lg">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-bold text-orange-400">Dinner Stats</h2>
				<div className="flex space-x-2">
					<button
						type="button"
						className={`rounded px-3 py-1 text-sm font-medium ${
							chartType === "pie"
								? "bg-orange-600 text-white"
								: "bg-gray-600 text-gray-300"
						}`}
						onClick={() => setChartType("pie")}
					>
						Pie
					</button>
					<button
						type="button"
						className={`rounded px-3 py-1 text-sm font-medium ${
							chartType === "bar"
								? "bg-orange-600 text-white"
								: "bg-gray-600 text-gray-300"
						}`}
						onClick={() => setChartType("bar")}
					>
						Bar
					</button>
				</div>
			</div>

			<div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="rounded-lg bg-gray-800 p-4">
					<h3 className="mb-1 text-sm font-medium text-gray-300">
						Dinner Pool
					</h3>
					<p className="text-2xl font-bold text-white">{stats.totalDinners}</p>
				</div>
				<div className="rounded-lg bg-gray-800 p-4">
					<h3 className="mb-1 text-sm font-medium text-gray-300">
						Total Generated
					</h3>
					<p className="text-2xl font-bold text-white">
						{stats.totalGenerated}
					</p>
				</div>
			</div>

			{stats.topGenerated.length > 0 ? (
				<>
					<h3 className="mb-2 text-sm font-medium text-gray-300">
						Most Generated Dinners
					</h3>

					<div className="h-64">
						<ResponsiveContainer height="100%" width="100%">
							{chartType === "pie" ? (
								<PieChart>
									<Pie
										cx="50%"
										cy="50%"
										data={stats.topGenerated}
										dataKey="count"
										fill="#8884d8"
										labelLine={false}
										outerRadius={80}
										label={({
											name,
											percent
										}: {
											name: string;
											percent: number;
										}) => `${name} (${(percent * 100).toFixed(0)}%)`}
									>
										{stats.topGenerated.map(
											(
												entry: { name: string; count: number },
												index: number
											) => (
												<Cell
													fill={COLORS[index % COLORS.length]}
													key={`cell-${index}`}
												/>
											)
										)}
									</Pie>
									<Tooltip
										formatter={(value: number) => [
											`${value} times`,
											"Generated"
										]}
									/>
								</PieChart>
							) : (
								<BarChart
									data={stats.topGenerated}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip
										formatter={(value: number) => [
											`${value} times`,
											"Generated"
										]}
									/>
									<Legend />
									<Bar dataKey="count" fill="#FF6B6B" name="Times Generated" />
								</BarChart>
							)}
						</ResponsiveContainer>
					</div>

					{stats.generationHistory.length > 1 && (
						<>
							<h3 className="mb-2 mt-6 text-sm font-medium text-gray-300">
								Generation History
							</h3>
							<div className="h-64">
								<ResponsiveContainer height="100%" width="100%">
									<BarChart
										data={stats.generationHistory}
										margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" />
										<YAxis />
										<Tooltip
											formatter={(value: number) => [
												`${value} dinners`,
												"Generated"
											]}
										/>
										<Legend />
										<Bar
											dataKey="count"
											fill="#4ECDC4"
											name="Dinners Generated"
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</>
					)}
				</>
			) : (
				<div className="py-8 text-center">
					<p className="text-gray-400">
						Generate some dinners to see your stats!
					</p>
				</div>
			)}
		</div>
	);
};

export default StatsComponent;
