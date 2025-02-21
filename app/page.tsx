import Link from "next/link";
import Image from "next/image";

import restaurantImage from "./utils/images/restaurant.jpg";

export default function Splash() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1 className="text-center text-6xl font-bold">
				Welcome to the Dinner Generator
			</h1>
			<Image alt="Restaurant" height={500} src={restaurantImage} width={500} />
			<p className="text-center text-2xl">
				Click the button below to generate a dinner ideas
			</p>
			<Link href="/home">
				<button
					className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
					type="button"
				>
					Get Started
				</button>
			</Link>
		</main>
	);
}
