import Link from "next/link";
import Image from "next/image";

import restaurantImage from "./utils/images/restaurant.jpg";

export default function Splash() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-6">
			<div className="mx-auto w-full max-w-3xl space-y-8 rounded-xl bg-gray-800/50 p-8 text-center shadow-2xl backdrop-blur-sm">
				<h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
					Welcome to the{" "}
					<span className="text-orange-400">Dinner Generator</span>
				</h1>

				<div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl shadow-lg sm:h-80">
					<Image
						fill
						priority
						alt="Delicious Meals"
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 800px"
						src={restaurantImage}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
					<div className="absolute inset-x-4 bottom-4 text-white">
						<p className="text-lg font-medium sm:text-xl">
							Solve the &quot;What&apos;s for dinner?&quot; dilemma
						</p>
					</div>
				</div>

				<div className="space-y-4">
					<p className="text-xl text-gray-300">
						Never struggle with meal decisions again. Create your dinner
						collection and let us pick for you!
					</p>

					<ul className="mx-auto max-w-md space-y-2 text-left text-gray-400">
						<li className="flex items-center">
							<span className="mr-2 text-orange-400">✓</span>
							Build your personalized dinner collection
						</li>
						<li className="flex items-center">
							<span className="mr-2 text-orange-400">✓</span>
							Generate random meal plans with one click
						</li>
						<li className="flex items-center">
							<span className="mr-2 text-orange-400">✓</span>
							Save your favorite meal combinations
						</li>
					</ul>
				</div>

				<Link className="inline-block" href="/home">
					<button
						className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-orange-700 hover:shadow-xl active:translate-y-0"
						type="button"
					>
						Get Started
					</button>
				</Link>
			</div>
		</main>
	);
}
