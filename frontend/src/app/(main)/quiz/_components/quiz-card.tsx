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

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { BookCheck, Clock3, NotepadTextDashed } from 'lucide-react';
import Link from 'next/link';
import { QuizButton } from './quiz-button';

interface QuizCardProps {
	id: string;
	title: string;
	has_user_attempted: boolean;
	time_limit: string;
	total_points: number;
	total_questions_count: number;
}

export function QuizCard({
	has_user_attempted,
	id,
	time_limit,
	title,
	total_points,
	total_questions_count,
}: QuizCardProps) {
	return (
		<>
			<Card className='max-w-xl w-full'>
				<CardHeader>
					<div className='flex items-start justify-between w-full h-full'>
						<div className='flex flex-col items-start justify-start space-y-1'>
							<CardTitle>{title}</CardTitle>
							<CardDescription>
								Quiz ID: <span className='font-semibold'>{id}</span>
							</CardDescription>
						</div>
						<Badge>{has_user_attempted ? 'Attempted' : 'Not Attempted'}</Badge>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					<Alert className='flex space-x-2 '>
						<Clock3 className='h-5 w-5' />
						<div className='flex flex-col items-start justify-start'>
							<AlertTitle className=''>Time Limit!</AlertTitle>
							<AlertDescription>
								You have {time_limit} to complete the quiz.
							</AlertDescription>
						</div>
					</Alert>

					<Alert className='flex space-x-2 '>
						<BookCheck className='h-5 w-5' />
						<div className='flex flex-col items-start justify-start'>
							<AlertTitle className=''>Total Points</AlertTitle>
							<AlertDescription>
								You can score a maximum of {total_points} points.
							</AlertDescription>
						</div>
					</Alert>

					<Alert className='flex space-x-2 '>
						<NotepadTextDashed className='h-5 w-5' />
						<div className='flex flex-col items-start justify-start'>
							<AlertTitle className=''>Total Questions</AlertTitle>
							<AlertDescription>
								You have to answer {total_questions_count} questions.
							</AlertDescription>
						</div>
					</Alert>
				</CardContent>
				<CardFooter className='flex justify-between'>
					{has_user_attempted && (
						<Link
							href={`/quiz/${id}/feedback`}
							className={cn(
								buttonVariants({
									className: 'w-full',
								})
							)}
						>
							View Feedback
						</Link>
					)}

					{!has_user_attempted && <QuizButton />}
				</CardFooter>
			</Card>
		</>
	);
}
