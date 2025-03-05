import Link from "next/link";

const Header = () => {
	return (
		<header className="bg-gray-800 shadow-md">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 justify-between">
					<div className="flex">
						<Link className="flex shrink-0 items-center" href="/">
							<span className="text-xl font-bold text-orange-400">
								Dinner Generator
							</span>
						</Link>
					</div>

					<nav className="flex items-center space-x-4">
						<Link
							className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
							href="/home"
						>
							Dinner List
						</Link>
						<Link
							className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
							href="/wheel"
						>
							Wheel
						</Link>
						<Link
							className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
							href="/meal-plan"
						>
							Meal Plan
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
