'use client';
import { useUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useQuizStore } from '@/store/quiz-store';

export const QuizAttemptTopBar = () => {
	const user = useUser();
	const { activeQuiz } = useQuizStore();

	return (
		<header className='flex items-center justify-center bg-gray-200 w-full px-4 font-roboto '>
			{/* username / email */}
			<div className='flex-1 text-sm font-medium hidden md:block'>
				{user?.user?.username ||
					// user?.firstName ||
					user?.user?.emailAddresses[0].emailAddress}
			</div>

			{/* Quiz Title */}
			<h1 className='flex-1 font-bold text-left md:text-center text-sm lg:text-base'>
				Quiz: {activeQuiz?.quiz_title}
			</h1>

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
		</header>
	);
};
