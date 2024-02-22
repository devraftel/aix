import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Button } from '@/components/ui/button';
import { CountdownClock } from '../../_components/countdown-clock';
import { QuizProgress } from '../../_components/quiz-progress';
import { QuizQuestion } from '../../_components/quiz-question';
import { QuizTopBar } from '../../_components/quiz-top-bar';

interface QuizAttempProps {
	params: {
		quiz_id: string;
	};
}

export default function QuizAttemp({ params }: QuizAttempProps) {
	const { quiz_id } = params;
	return (
		<>
			<QuizTopBar />
			<MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
				<div className='flex flex-col items-center justify-center space-y-10 md:space-y-16 lg:space-y-20 w-full'>
					<CountdownClock />

					<QuizQuestion />

					<div className='flex items-center justify-center w-full space-x-4 md:space-x-6 lg:space-x-8'>
						<QuizProgress
							currentQuestion={5}
							totalQuestions={10}
						/>
						<Button
							className='px-6 md:px-8 lg:px-10 h-9'
							size='default'
						>
							Continue
						</Button>
					</div>
				</div>
			</MaxWidthWrapper>
		</>
	);
}
