import { Inter } from "next/font/google";

import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Dinner Generator",
	description: "Dinner generator for the indecisive"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<div className="flex min-h-screen flex-col">
					<Header />
					<main className="grow">{children}</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
