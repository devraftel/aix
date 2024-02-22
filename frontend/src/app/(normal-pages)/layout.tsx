import Navbar from '@/components/navbar';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Navbar />
			<main className='flex flex-col w-full flex-1 items-center justify-center mx-auto max-w-7xl'>
				{children}
			</main>
		</div>
	);
};

export default Layout;
