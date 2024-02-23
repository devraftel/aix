import { getQuizList } from '@/components/actions/quiz';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { QuizList } from './_components/table/columns';
import { QuizListTable } from './_components/table/data-table';

export default async function QuizList() {
	const quizList = await getQuizList();

	if (!quizList.data) {
		return <div>Error fetching quiz list</div>;
	}

	console.log('quizList', quizList);

	const updatedList: QuizList[] = quizList.data.data.map((quiz) => {
		return {
			id: quiz.id,
			quizTitle: quiz.title,
			totalQuestions: quiz.total_questions_count,
			total_points: quiz.total_points,
			status: quiz?.has_user_attempted ? 'complete' : 'available',
			time_limit: quiz?.time_limit,
		};
	});

	return (
		<>
			<MaxWidthWrapper className='mb-12 mt-14 sm:mt-20'>
				<h1 className='font-semibold text-2xl text-left mb-4'>Quiz List</h1>
				<hr className='mb-6 w-[20%]' />
				<QuizListTable data={updatedList} />
			</MaxWidthWrapper>
		</>
	);
}
