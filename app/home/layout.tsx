import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Aint No Way I Am Reading All That"
};

export default function Home({ children }: { children: React.ReactNode }) {
	return (
		<>
			<main className="flex min-h-screen flex-col">{children}</main>
		</>
	);
}
