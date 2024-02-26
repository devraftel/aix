import MaxWidthWrapper from '@/components/max-width-wrapper';
import { buttonVariants } from '@/components/ui/button';
import { cn, getBaseURL } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import Link from 'next/link';

const getQuizResult = async (quiz_id: string) => {
	if (!quiz_id) {
		throw new Error('quiz_id is required to get quiz result');
	}

	const { userId, sessionId } = auth();

	if (!userId || !sessionId) {
		throw new Error('User is not logged in');
	}

	const baseUrl = getBaseURL();

	const res = await fetch(`${baseUrl}/quiz-attempt/user/${quiz_id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sessionId}`,
		},
	});

	if (!res.ok) {
		console.log(
			'GET /api/quiz-attempt/user/:quiz_id failed',
			res.status,
			res.statusText
		);
		throw new Error('Could not fetch quiz result');
	}

	const data = await res.json();

	console.log('GET /api/quiz-attempt/user/:quiz_id success', data);

	return data;
};

interface Props {
	params: {
		quiz_id: string;
	};
	searchParams: { [key: string]: string };
}

const page = async ({ params, searchParams }: Props) => {
	const { quiz_id } = params;
	console.log('searchParams', searchParams);

	const {
		attempt_score,
		created_at,
		id,
		quiz_feedback_id,
		quiz_id: QuizId,
		time_finish,
		time_limit,
		time_start,
		total_points,
		updated_at,
		user_id,
	} = searchParams;

	if (!quiz_id) {
		throw new Error('quiz_id is required');
	}

	let attempt_score_str = parseFloat(attempt_score);
	let total_points_str = parseFloat(total_points);

	attempt_score_str = isNaN(attempt_score_str) ? 0 : attempt_score_str;
	total_points_str = isNaN(total_points_str) ? 1 : total_points_str; // Avoid division by zero
	let percentage = (attempt_score_str / total_points_str) * 100;
	let formattedPercentage = percentage.toFixed(2);

	return (
		<MaxWidthWrapper className='mb-20 sm:mb-36 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center h-[40vh]'>
			<div className='bg-aix-frosted border border-aix-200 rounded-3xl drop-shadow-md backdrop-blur-md w-full py-[5rem] px-[7rem] flex flex-col items-center justify-center space-y-4'>
				<h1 className='text-3xl sm:text-4xl md:text-5xl capitalize '>
					You Scored
				</h1>
				<h2 className='text-xl sm:text-2xl md:text-3xl'>
					{formattedPercentage} %
				</h2>
				<ul>
					<li>Total Points: {total_points}</li>
					<li>Attempt Points: {attempt_score}</li>
				</ul>
				<div className='space-x-2 md:space-x-4 flex items-center w-full max-w-md'>
					<Link
						href={`/quiz`}
						className={cn(
							buttonVariants({
								variant: 'outline',
								className: 'flex-1',
							})
						)}
					>
						Go Back
					</Link>
					<Link
						href={`/quiz/${id}/feedback`}
						className={cn(
							buttonVariants({
								className: 'flex-1',
							})
						)}
					>
						View Feedback
					</Link>
				</div>
			</div>
		</MaxWidthWrapper>
	);
};

export default page;
