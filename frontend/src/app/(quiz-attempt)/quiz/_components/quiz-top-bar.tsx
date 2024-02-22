import { Button } from '@/components/ui/button';
import { currentUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import Link from 'next/link';

export const QuizTopBar = async () => {
	const user = await currentUser();

	return (
		<div className='flex items-center justify-center bg-gray-200 w-full px-4 font-roboto '>
			{/* username / email */}
			<div className='flex-1 text-sm font-medium hidden md:block'>
				{user?.username ||
					// user?.firstName ||
					user?.emailAddresses[0].emailAddress}
			</div>

			{/* Quiz Title */}
			<div className='flex-1 font-bold text-left md:text-center text-sm lg:text-base'>
				Quiz: Compose
			</div>

			{/* Exit Button */}
			<Link
				className='flex-1 flex justify-end'
				href={'/'}
			>
				<Button
					className=''
					size='icon'
					variant='ghost'
				>
					<X className='w-4 h-4' />
					<span className='sr-only'>Exit</span>
				</Button>
			</Link>
		</div>
	);
};
