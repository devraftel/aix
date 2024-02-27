'use client';
import { Button } from '@/components/ui/button';
import { useQuizDialogStore } from '@/store/quiz-dialog-store';

export const QuizButton = () => {
	const { isQuizDialogOpen, setQuizDialogStatus } = useQuizDialogStore();

	return (
		<>
			<Button
				onClick={() => {
					setQuizDialogStatus(!isQuizDialogOpen);
				}}
				className='w-full'
			>
				Start Quiz
			</Button>
		</>
	);
};
