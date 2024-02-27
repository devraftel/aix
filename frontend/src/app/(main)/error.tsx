'use client';

import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const pathname = usePathname();

	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div>
			<MaxWidthWrapper className='flex flex-col items-center justify-center text-center h-[40rem]'>
				<h2 className='text-xl sm:text-2xl md:text-3xl font-roboto'>
					Oops! We encountered an issue:
					<br />
					<span className='text-lg sm:text-xl md:text-2xl font-mono font-bold'>
						{pathname}
					</span>
					<span className='text-lg sm:text-xl md:text-2xl font-mono'>
						{' '}
						- &quot;{error.message}&quot;
					</span>
				</h2>
				<Button
					className='px-[4rem] mt-4 md:mt-8'
					onClick={() => reset()}
				>
					Try again
				</Button>
			</MaxWidthWrapper>
		</div>
	);
}
