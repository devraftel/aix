import { BookCheck, Clock3, NotepadTextDashed } from 'lucide-react';
import Link from 'next/link';

import { cn, formatSeconds } from '@/lib/utils';
import { QuizButton } from '../_components/quiz-button';

import { getQuiz } from '@/components/actions/quiz';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

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

	return (
		<MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
			<Card className='max-w-xl w-full'>
				<CardHeader>
					<div className='flex items-start justify-between w-full h-full'>
						<div className='flex flex-col items-start justify-start space-y-1'>
							<CardTitle>{data?.title}</CardTitle>
							<CardDescription>
								Quiz ID: <span className='font-semibold'>{data?.id}</span>
							</CardDescription>
						</div>
						<Badge>
							{data?.has_user_attempted ? 'Attempted' : 'Not Attempted'}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Alert className='flex space-x-2 '>
						<Clock3 className='h-5 w-5' />
						<div className='flex flex-col items-start justify-start'>
							<AlertTitle className=''>Time Limit!</AlertTitle>
							<AlertDescription>
								You have {formatSeconds(data?.time_limit)} to complete the quiz.
							</AlertDescription>
						</div>
					</Alert>

					<Alert className='flex space-x-2 '>
						<BookCheck className='h-5 w-5' />
						<div className='flex flex-col items-start justify-start'>
							<AlertTitle className=''>Total Points</AlertTitle>
							<AlertDescription>
								You can score a maximum of {data?.total_points} points.
							</AlertDescription>
						</div>
					</Alert>

					<Alert className='flex space-x-2 '>
						<NotepadTextDashed className='h-5 w-5' />
						<div className='flex flex-col items-start justify-start'>
							<AlertTitle className=''>Total Questions</AlertTitle>
							<AlertDescription>
								You have to answer {data?.total_questions_count} questions.
							</AlertDescription>
						</div>
					</Alert>
				</CardContent>
				<CardFooter className='flex justify-between'>
					{data?.has_user_attempted && (
						<Link
							href={`/quiz/${data?.id}/feedback`}
							className={cn(
								buttonVariants({
									className: 'w-full',
								})
							)}
						>
							View Feedback
						</Link>
					)}

					{!data?.has_user_attempted && <QuizButton />}
				</CardFooter>
			</Card>
		</MaxWidthWrapper>
	);
};

export default QuizPage;
