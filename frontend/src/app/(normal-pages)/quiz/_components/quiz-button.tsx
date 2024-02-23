'use client';

import { Button } from '@/components/ui/button';
import { useQuizStartStore } from '@/store/quiz-start-store';

export const QuizButton = () => {
	const { isQuizStartOpen, setIsQuizStartOpen } = useQuizStartStore();

	return (
		<Button
			onClick={() => {
				setIsQuizStartOpen(!isQuizStartOpen);
			}}
			className='w-full'
		>
			Start Quiz
		</Button>
	);
};
