'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { usePathname, useRouter } from 'next/navigation';
import { useQuizStartStore } from '../store/quiz-start-store';

export function QuizStartDialog() {
	const { isQuizStartOpen, setIsQuizStartOpen, quizId } = useQuizStartStore();
	const router = useRouter();

	const pathname = usePathname();

	const id = pathname.split('/').pop();

	return (
		<Dialog
			open={isQuizStartOpen}
			onOpenChange={setIsQuizStartOpen}
			defaultOpen={false}
		>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold'>
						Quiz Initialization
					</DialogTitle>
					<DialogDescription className='text-gray-700 mt-2'>
						You are about to start the quiz. Ensure you are ready as the timer
						will start immediately.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						type='button'
						className='w-full border-gray-500 border'
						variant={'outline'}
						onClick={() => {
							setIsQuizStartOpen(!isQuizStartOpen);
						}}
					>
						Cancel
					</Button>
					<Button
						type='button'
						className='w-full'
						// disabled={!quizId || quizId !== id}
						onClick={() => {
							router.push(`/quiz/${quizId || id}/attempt`);
							setIsQuizStartOpen(!isQuizStartOpen);
						}}
					>
						Start
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
