const Footer = () => {
	return (
		<footer className="bg-gray-800 py-4">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<p className="text-center text-sm text-gray-400">
					Dinner Generator &copy; {new Date().getFullYear()} - Never be
					indecisive about dinner again
				</p>
			</div>
		</footer>
	);
};

export default Footer;
