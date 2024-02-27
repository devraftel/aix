'use client';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { QUERY_KEY } from '@/lib/constants';
import { QuizAttempt, useQuizAttemptStore } from '@/store/quiz-attempt-store';

import { attempt } from '@/components/actions/attempt';
import { submitQuiz } from '@/components/actions/quiz';
import MaxWidthWrapper from '@/components/max-width-wrapper';

import {
	QuizMultiselectQuestion,
	QuizOpentextQuestion,
	QuizSingleSelectQuestion,
} from '@/app/(quiz-attempt)/_components/quiz-question';
import { QuizTimer } from '@/app/(quiz-attempt)/_components/quiz-timer';

interface QuizAttempProps {
	params: {
		quiz_id: string;
	};
}

export default function QuizAttempt({ params }: QuizAttempProps) {
	const { quiz_id } = params;
	const router = useRouter();
	const pathname = usePathname();

	const {
		setQuizAttempt,
		quizAttempt,
		currentQuestionIndex,
		submitQuestion,
		setCurrentQuestionIndex,
		reset,
	} = useQuizAttemptStore();

	const { data, error, status } = useQuery({
		queryKey: [QUERY_KEY.ATTEMPT, quiz_id],
		queryFn: () => attempt(quiz_id),
	});

	const handleQuestionSubmit = useCallback(async () => {
		try {
			if (currentQuestionIndex < quizAttempt?.questions.length! - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
			} else {
				toast('Quiz Completed', { description: 'Quiz has been submitted' });
				const res = await submitQuiz(quizAttempt?.id!);

				if (res.error) {
					toast('Error Finishing quiz', { description: res.error });
					return;
				}

				if (res?.data) {
					const { data } = res;
					const stringifiedData = Object.fromEntries(
						Object.entries(data).map(([key, value]) => [key, String(value)])
					);
					const params = new URLSearchParams(stringifiedData);

					reset();
					router.push(`/quiz/${quizAttempt?.id}/result?${params}`);
				}
			}
		} catch (error) {
			toast('Error submitting quiz', {
				description: (error as { message: string }).message,
			});
		}
	}, [
		currentQuestionIndex,
		quizAttempt,
		reset,
		setCurrentQuestionIndex,
		router,
	]);

	useEffect(() => {
		if (data?.data) setQuizAttempt(data?.data);
	}, [data, setQuizAttempt]);

	if (error) {
		toast('Error loading quiz', { description: error?.message });
		return <div>Error loading quiz</div>;
	}

	if (status === 'success' && data.error === 'Unable to attempt quiz') {
		toast('Quiz already attempted', {
			description: 'You have already attempted this quiz',
		});
		router.push('/quiz');
		return null;
	}

	const currentQuestion = quizAttempt?.questions[currentQuestionIndex];
	const isLastQuestion =
		currentQuestionIndex === quizAttempt?.questions.length! - 1;

	return (
		<QuizLayout
			title={data?.data?.quiz_title ?? 'Quiz title'}
			currentQuestion={currentQuestion}
			isLastQuestion={isLastQuestion}
			handleQuestionSubmit={handleQuestionSubmit}
			quizAttempt={quizAttempt!}
			currentQuestionIndex={currentQuestionIndex}
		/>
	);
}

interface QuizLayoutProps {
	title: string;
	currentQuestion: any;
	isLastQuestion: boolean;
	handleQuestionSubmit: () => void;
	quizAttempt: QuizAttempt;
	currentQuestionIndex: number;
}

function QuizLayout({
	title,
	currentQuestion,
	isLastQuestion,
	handleQuestionSubmit,
	quizAttempt,
	currentQuestionIndex,
}: QuizLayoutProps) {
	console.log('quizAttempt', quizAttempt);

	return (
		<>
			<MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
				<div className='flex flex-col items-center justify-center space-y-10 md:space-y-16 lg:space-y-20 w-full'>
					<QuizTimer
						startTime={quizAttempt?.time_start}
						totalTime={parseFloat(quizAttempt?.time_limit)}
						onExpire={handleQuestionSubmit}
					/>

					{currentQuestion?.question_type === 'open_text_question' && (
						<QuizOpentextQuestion
							attempt_id={quizAttempt?.id!}
							question_id={currentQuestion?.id!}
							question_text={currentQuestion?.question_text!}
							question_type={currentQuestion?.question_type!}
							mcq_options={currentQuestion?.mcq_options!}
							total_questions={quizAttempt?.questions.length!}
							current_question={currentQuestionIndex + 1}
							handleSubmit={handleQuestionSubmit}
							isLastQuestion={isLastQuestion}
						/>
					)}

					{currentQuestion?.question_type === 'single_select_mcq' && (
						<QuizSingleSelectQuestion
							attempt_id={quizAttempt?.id!}
							question_id={currentQuestion?.id!}
							question_text={currentQuestion?.question_text!}
							question_type={currentQuestion?.question_type!}
							mcq_options={currentQuestion?.mcq_options!}
							total_questions={quizAttempt?.questions.length!}
							current_question={currentQuestionIndex + 1}
							handleSubmit={handleQuestionSubmit}
							isLastQuestion={isLastQuestion}
						/>
					)}

					{currentQuestion?.question_type === 'multi_select_mcq' && (
						<QuizMultiselectQuestion
							attempt_id={quizAttempt?.id!}
							question_id={currentQuestion?.id!}
							question_text={currentQuestion?.question_text!}
							question_type={currentQuestion?.question_type!}
							mcq_options={currentQuestion?.mcq_options!}
							total_questions={quizAttempt?.questions.length!}
							current_question={currentQuestionIndex + 1}
							handleSubmit={handleQuestionSubmit}
							isLastQuestion={isLastQuestion}
						/>
					)}
				</div>
			</MaxWidthWrapper>
		</>
	);
}
