import { ReactNode } from 'react';

import { DialogWrapper } from '@/components/dialog-wrapper';
import { Footer } from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Navbar />
			<main className='flex flex-col w-full flex-1 items-center justify-center mx-auto max-w-7xl'>
				{children}
				<DialogWrapper />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
