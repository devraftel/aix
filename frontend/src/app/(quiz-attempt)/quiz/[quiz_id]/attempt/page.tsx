'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Quiz } from '@/type/quiz';
import { useQuizAttemptManagement } from './useQuizAttemptManagement';

import {
	QuizMultiselectQuestion,
	QuizOpentextQuestion,
	QuizSingleSelectQuestion,
} from '@/app/(quiz-attempt)/_components/quiz-question';
import { QuizTimer } from '@/app/(quiz-attempt)/_components/quiz-timer';
import { LoaderPencil } from '@/components/loader-pencil';
import MaxWidthWrapper from '@/components/max-width-wrapper';

interface QuizAttempProps {
	params: {
		quiz_id: string;
	};
}

export default function QuizAttempt({ params }: QuizAttempProps) {
	const { quiz_id } = params;
	const router = useRouter();

	const {
		activeQuiz,
		currentQuestionIdx,
		handleFinishQuiz,
		quizError,
		quizStatus,
	} = useQuizAttemptManagement(quiz_id);

	if (quizStatus === 'pending') {
		return (
			<div className='flex flex-col items-center h-[40vh] justify-center space-y-2 md:space-y-4'>
				<LoaderPencil />
				<h1 className='sm:text-lg md:text-xl'>Loading quiz...</h1>
			</div>
		);
	}

	if (quizError) {
		toast('Error loading quiz', { description: quizError });
		return <div>Error loading quiz</div>;
	}

	// if (quizStatus === 'success' && !activeQuiz) {
	// 	toast('Quiz already attempted', {
	// 		description: 'You have already attempted this quiz',
	// 	});
	// 	router.push(`/quiz/${quiz_id}`);
	// 	return null;
	// }

	const currentQuestion = activeQuiz?.questions[currentQuestionIdx];
	const isLastQuestion =
		currentQuestionIdx === activeQuiz?.questions.length! - 1;

	console.log('activeQuiz', activeQuiz);
	// console.log('handleFinishQuiz', handleFinishQuiz);
	console.log('currentQuestionIndex', currentQuestionIdx);
	console.log('isLastQuestion', isLastQuestion);

	return (
		<QuizLayout
			title={activeQuiz?.quiz_title ?? 'Quiz title'}
			currentQuestion={currentQuestion}
			isLastQuestion={isLastQuestion}
			handleFinishQuiz={handleFinishQuiz}
			quizAttempt={activeQuiz!}
			currentQuestionIndex={currentQuestionIdx}
		/>
	);
}

interface QuizLayoutProps {
	title: string;
	currentQuestion: any;
	isLastQuestion: boolean;
	handleFinishQuiz: () => void;
	quizAttempt: Quiz;
	currentQuestionIndex: number;
}

function QuizLayout({
	currentQuestion,
	isLastQuestion,
	handleFinishQuiz,
	quizAttempt,
	currentQuestionIndex,
}: QuizLayoutProps) {
	return (
		<>
			<MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
				<div className='flex flex-col items-center justify-center space-y-10 md:space-y-16 lg:space-y-20 w-full'>
					<QuizTimer
						startTime={quizAttempt?.time_start}
						totalTime={parseFloat(quizAttempt?.time_limit)}
						onExpire={handleFinishQuiz}
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
							handleSubmit={handleFinishQuiz}
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
							handleSubmit={handleFinishQuiz}
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
							handleSubmit={handleFinishQuiz}
							isLastQuestion={isLastQuestion}
						/>
					)}
				</div>
			</MaxWidthWrapper>
		</>
	);
}
