import { getQuiz } from '@/components/actions/quiz';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { QuizCard } from '../_components/quiz-card';

interface QuizFeedback {
	params: {
		quiz_id: string;
	};
}

const QuizPage = async ({ params }: QuizFeedback) => {
	const { quiz_id } = params;

	const { data, error } = await getQuiz(quiz_id);

	if (!data) {
		return <div>Quiz not found : {error}</div>;
	}

	console.log('Quiz', data);

	return (
		<MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
			<QuizCard
				has_user_attempted={data.has_user_attempted}
				id={data.id}
				time_limit={data.time_limit}
				title={data.title}
				total_points={data.total_points}
				total_questions_count={data.total_questions_count}
			/>
		</MaxWidthWrapper>
	);
};

export default QuizPage;
