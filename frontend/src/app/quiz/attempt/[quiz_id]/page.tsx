import MaxWidthWrapper from '@/components/max-width-wrapper';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface QuizAttempProps {
	params: {
		quiz_id: string;
	};
}

export default function QuizAttemp({ params }: QuizAttempProps) {
	const { quiz_id } = params;
	return (
		<>
			<MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
				<h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
					Generate Quiz {quiz_id}
				</h1>

				<Link
					className={buttonVariants({
						size: 'lg',
						className: 'mt-5',
					})}
					href='/dashboard'
					target='_blank'
				>
					Start <ArrowRight className='ml-2 h-5 w-5' />
				</Link>
			</MaxWidthWrapper>
		</>
	);
}
