import { getQuiz } from '@/components/actions/quiz';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { CountdownClock } from '../../_components/countdown-clock';
import { QuizQuestion } from '../../_components/quiz-question';
import { QuizTopBar } from '../../_components/quiz-top-bar';

interface QuizAttempProps {
	params: {
		quiz_id: string;
	};
}

export default async function QuizAttemp({ params }: QuizAttempProps) {
	const { quiz_id } = params;
	const quiz = await getQuiz(quiz_id);

	if (!quiz.data) {
		return <div>Quiz not found</div>;
	}

	console.log('Quiz', quiz.data);

	return (
		<>
			<QuizTopBar title={quiz.data.title} />
			<MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
				<div className='flex flex-col items-center justify-center space-y-10 md:space-y-16 lg:space-y-20 w-full'>
					<CountdownClock />

					<QuizQuestion />
				</div>
			</MaxWidthWrapper>
		</>
	);
}
