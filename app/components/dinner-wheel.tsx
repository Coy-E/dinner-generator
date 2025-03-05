"use client";
import { useState, useRef, useEffect } from "react";

import type React from "react";

interface WheelProps {
	items: Array<string>;
	onSelect: (item: string) => void;
	colorScheme?: Array<string>; // optional color scheme
}

const DinnerWheel: React.FC<WheelProps> = ({
	items,
	onSelect,
	colorScheme = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2"]
}) => {
	const [rotation, setRotation] = useState(0);
	const [selectedItem, setSelectedItem] = useState<string | null>(null);
	const [isSpinning, setIsSpinning] = useState(false);
	const canvasReference = useRef<HTMLCanvasElement>(null);
	const wheelRadius = 200;

	// Draw the wheel whenever items change
	useEffect(() => {
		if (items.length === 0 || !canvasReference.current) return;

		const canvas = canvasReference.current;
		const context = canvas.getContext("2d");
		if (!context) return;

		// Clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const sliceAngle = (2 * Math.PI) / items.length;

		// Draw wheel segments
		for (const [index, item] of items.entries()) {
			// Start drawing at the last rotation point
			const startAngle = index * sliceAngle + rotation;
			const endAngle = (index + 1) * sliceAngle + rotation;

			// Get color from scheme or generate a color if we run out
			const color = colorScheme[index % colorScheme.length];

			// Draw slice
			context.beginPath();
			context.moveTo(centerX, centerY);
			context.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
			context.closePath();
			context.fillStyle = color;
			context.fill();
			context.strokeStyle = "#333";
			context.lineWidth = 2;
			context.stroke();

			// Add text
			context.save();
			context.translate(centerX, centerY);
			context.rotate(startAngle + sliceAngle / 2);
			context.textAlign = "right";
			context.fillStyle = "#fff";
			context.font = "bold 14px Arial";

			// Draw text aligned to fit inside the slice
			const textDistance = wheelRadius * 0.75;
			context.fillText(item, textDistance, 5);
			context.restore();
		}

		// Draw center circle
		context.beginPath();
		context.arc(centerX, centerY, 20, 0, 2 * Math.PI);
		context.fillStyle = "#333";
		context.fill();

		// Draw pointer/indicator
		context.beginPath();
		context.moveTo(centerX + wheelRadius + 10, centerY);
		context.lineTo(centerX + wheelRadius - 10, centerY - 15);
		context.lineTo(centerX + wheelRadius - 10, centerY + 15);
		context.closePath();
		context.fillStyle = "#e74c3c";
		context.fill();
	}, [items, rotation, colorScheme]);

	const spinWheel = () => {
		if (isSpinning || items.length === 0) return;

		setIsSpinning(true);
		setSelectedItem(null);

		// Random rotation between 2 and 5 full spins
		const spinCount = 2 + Math.random() * 3;
		const targetRotation = rotation + spinCount * 2 * Math.PI;

		// Animate the wheel
		let start: number | null = null;
		const duration = 3000; // 3 seconds

		const animate = (timestamp: number) => {
			if (!start) start = timestamp;
			const progress = (timestamp - start) / duration;

			if (progress < 1) {
				// Easing function for smooth deceleration
				const easeOut = 1 - Math.pow(1 - progress, 3);
				setRotation(rotation + (targetRotation - rotation) * easeOut);
				requestAnimationFrame(animate);
			} else {
				// Animation complete
				setRotation(targetRotation % (2 * Math.PI));

				// Determine selected item
				const sliceAngle = (2 * Math.PI) / items.length;
				const normalizedRotation = targetRotation % (2 * Math.PI);
				const selectedIndex =
					items.length -
					(Math.floor(normalizedRotation / sliceAngle) % items.length) -
					1;

				setSelectedItem(items[selectedIndex]);
				onSelect(items[selectedIndex]);
				setIsSpinning(false);
			}
		};

		requestAnimationFrame(animate);
	};

	return (
		<div className="flex flex-col items-center">
			<div className="relative mb-4">
				<canvas
					className={`${isSpinning ? "cursor-not-allowed" : "cursor-pointer"} transition-transform`}
					height={wheelRadius * 2 + 50}
					ref={canvasReference}
					width={wheelRadius * 2 + 50}
					onClick={spinWheel}
				/>
			</div>

			<button
				disabled={isSpinning || items.length === 0}
				type="button"
				className={`rounded-lg px-6 py-3 font-semibold text-white ${
					isSpinning || items.length === 0
						? "cursor-not-allowed bg-gray-500"
						: "bg-orange-600 hover:bg-orange-700 active:scale-95"
				}`}
				onClick={spinWheel}
			>
				{isSpinning ? "Spinning..." : "Spin the Wheel!"}
			</button>

			{selectedItem && (
				<div className="mt-6 text-center">
					<h3 className="text-xl font-bold text-gray-300">Selected Dinner:</h3>
					<p className="mt-2 text-2xl font-bold text-orange-400">
						{selectedItem}
					</p>
				</div>
			)}

			{items.length === 0 && (
				<p className="mt-4 text-gray-400">
					Add some dinners to your collection first!
				</p>
			)}
		</div>
	);
};

export default DinnerWheel;
