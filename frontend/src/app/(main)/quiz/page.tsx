import { getQuizList } from '@/components/actions/quiz';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { QuizList } from './_components/table/columns';
import { QuizListTable } from './_components/table/data-table';

export default async function QuizList() {
	const quizList = await getQuizList();

	if (quizList.error?.status === 404) {
		return (
			<MaxWidthWrapper className='mb-20 sm:mb-36 mt-20 sm:mt-32 flex flex-col space-y-4 md:space-y-8 items-center justify-center h-[40rem]'>
				<div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 w-full items-start justify-between'>
					<div>
						<h1 className='text-2xl md:text-3xl pb-1 sm:pb-2'>
							No Quizzes Available.
						</h1>
						<p className='[&:not(:first-child)]:mt-0'>
							Create a new quiz to get started.
						</p>
					</div>
					<Link
						href='/quiz/generate'
						className={cn(buttonVariants({ size: 'sm' }))}
					>
						Create a new quiz
					</Link>
				</div>

				<div className='bg-aix-frosted w-full py-[2rem] px-[3rem] text-aix-900 border border-aix-200 drop-shadow-sm  rounded-3xl'>
					<QuizListTable data={[]} />
				</div>
			</MaxWidthWrapper>
		);
	}

	if (quizList.error || !quizList.data) {
		return (
			<MaxWidthWrapper className='mb-20 sm:mb-36 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center h-[40rem]'>
				{quizList.error?.message}
			</MaxWidthWrapper>
		);
	}

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
			<MaxWidthWrapper className='mb-20 sm:mb-36 mt-28 sm:mt-40 flex flex-col items-center justify-center h-[40rem]'>
				<h1 className='font-semibold text-2xl text-left mb-4'>Quiz List</h1>
				<hr className='mb-6 w-[20%]' />
				<QuizListTable data={updatedList || []} />
			</MaxWidthWrapper>
		</>
	);
}
