'use client';
import { attempt } from '@/components/actions/attempt';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { QUERY_KEY } from '@/lib/constants';
import { useQuizAttemptStore } from '@/store/quiz-attempt-store';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { submitQuiz } from '@/components/actions/quiz';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CountdownClock } from '../../_components/countdown-clock';
import { QuizMultiselectQuestion } from '../../_components/quiz-multiselect-question';
import { QuizOpentextQuestion } from '../../_components/quiz-opentext-question';
import { QuizSingleSelectQuestion } from '../../_components/quiz-singleselect-question';
import { QuizTopBar } from '../../_components/quiz-top-bar';

interface QuizAttempProps {
	params: {
		quiz_id: string;
	};
}

export default function QuizAttemp({ params }: QuizAttempProps) {
	const { quiz_id } = params;
	const router = useRouter();
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

	const handleQuestionSubmit = useCallback(() => {
		if (currentQuestionIndex < quizAttempt?.questions.length! - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			toast('Quiz Completed', { description: 'Quiz has been submitted' });
			submitQuiz(quizAttempt?.id!);
			reset();
			router.push(`/quiz/${quizAttempt?.id}/feedback`);
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
		<>
			<QuizTopBar title={data?.data?.quiz_title ?? 'Quiz title'} />
			<MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
				<div className='flex flex-col items-center justify-center space-y-10 md:space-y-16 lg:space-y-20 w-full'>
					<CountdownClock />

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
