import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
	totalQuestions: number;
	currentQuestion: number;
}

export const QuizProgress = ({
	currentQuestion,
	totalQuestions,
}: QuizProgressProps) => {
	const value: number = (currentQuestion / totalQuestions) * 100;
	return (
		<div className='flex flex-col space-y-2 sm:space-y-0 space-x-0 md:space-y-0 md:flex-row items-center md:space-x-4 w-full '>
			<Progress value={value} />
			<span className='text-sm font-medium text-gray-950 flex-shrink-0'>
				{currentQuestion} / {totalQuestions}
			</span>
		</div>
	);
};
