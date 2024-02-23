'use client';
import { attempt } from '@/components/actions/attempt';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { QUERY_KEY } from '@/lib/constants';
import { useQuizAttemptStore } from '@/store/quiz-attempt-store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { CountdownClock } from '../../_components/countdown-clock';
import { QuizQuestion } from '../../_components/quiz-question';

interface QuizAttempProps {
	params: {
		quiz_id: string;
	};
}

export default function QuizAttemp({ params }: QuizAttempProps) {
	const { quiz_id } = params;
	const { quizAttempt, setQuizAttempt } = useQuizAttemptStore();

	const { data, error } = useQuery({
		queryKey: [QUERY_KEY.ATTEMPT, quiz_id],
		queryFn: () => attempt(quiz_id),
	});

	useEffect(() => {
		if (data?.data) setQuizAttempt(data?.data);
	}, [data, setQuizAttempt]);

	console.log('Quiz', quizAttempt);

	return (
		<>
			{/* <QuizTopBar title={data?.data?.quiz_title ?? 'Quiz title'} /> */}
			<MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
				<div className='flex flex-col items-center justify-center space-y-10 md:space-y-16 lg:space-y-20 w-full'>
					<CountdownClock />

					<QuizQuestion />
				</div>
			</MaxWidthWrapper>
		</>
	);
}
