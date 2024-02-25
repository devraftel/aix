import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Open_Sans, Roboto } from 'next/font/google';
import './globals.css';

import { QueryProvider } from '@/components/query-provider';
import { cn } from '@/lib/utils';
import { ClerkProvider } from '@clerk/nextjs';

const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-opensans' });
const robot = Roboto({
	subsets: ['latin'],
	variable: '--font-roboto',
	weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
	title: 'AIX GPT',
	description: 'Gen AI Powered Quizzes and Feedback Assistant',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body
					className={cn(
						'min-h-screen font-sans antialiased grainy bg-aix-100 text-aix-800',
						openSans.className,
						robot.variable
					)}
				>
					<QueryProvider>{children}</QueryProvider>
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	);
}
