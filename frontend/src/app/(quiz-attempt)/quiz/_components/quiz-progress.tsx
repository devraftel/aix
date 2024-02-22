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
		<div className='flex items-center space-x-4 w-full '>
			<Progress value={value} />
			<span className='text-sm font-medium text-gray-950 flex-shrink-0'>
				{currentQuestion} / {totalQuestions}
			</span>
		</div>
	);
};
