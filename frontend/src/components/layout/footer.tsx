import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Logo } from '../logo';
import { buttonVariants } from '../ui/button';

export const Footer = () => {
	return (
		<footer className='bg-white text-aix-900 w-full'>
			<nav className='container mx-auto px-6 py-2 flex justify-between items-center'>
				<Logo />

				<div className='flex items-center'>
					<div className='hidden md:flex items-center'>
						<Link
							href={'/about'}
							className={cn(
								buttonVariants({
									size: 'sm',
									variant: 'link',
								})
							)}
						>
							About Us
						</Link>
						<Link
							href={'/privacy-policy'}
							className={cn(
								buttonVariants({
									size: 'sm',
									variant: 'link',
								})
							)}
						>
							Privacy Policy
						</Link>

						<Link
							href={'/contact'}
							className={cn(
								buttonVariants({
									size: 'sm',
									variant: 'link',
								})
							)}
						>
							Contact
						</Link>
					</div>
				</div>
			</nav>
			<div className='text-center py-4 mt-2   text-sm'>
				&copy; {new Date().getFullYear()} Aix. All rights reserved.
			</div>
		</footer>
	);
};
