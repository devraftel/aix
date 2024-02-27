import { attempt } from '@/components/actions/attempt';
import { submitQuiz } from '@/components/actions/quiz';
import { QUERY_KEY } from '@/lib/constants';
import { useQuizStore } from '@/store/quiz-store';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export function useQuizAttemptManagement(quizId: string) {
	const router = useRouter();
	const { data, error, status } = useQuery({
		queryKey: [QUERY_KEY.ATTEMPT, quizId],
		queryFn: () => attempt(quizId),
	});

	const {
		activeQuiz,
		currentQuestionIdx,
		nextQuestion,
		resetActiveQuiz,
		setActiveQuiz,
		setIsSubmitting,
		setQuizError,
		isSubmitting,
	} = useQuizStore();

	useEffect(() => {
		if (status === 'pending') return;

		if (data?.data) setActiveQuiz(data.data);
		if (data?.error) setQuizError(data.error);
		if (error) setQuizError(error.message);
	}, [data, setActiveQuiz, setQuizError, error, status]);

	const handleFinishQuiz = useCallback(async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);

		try {
			if (currentQuestionIdx < activeQuiz?.questions.length! - 1) {
				nextQuestion();
				router.refresh();
			} else {
				toast('Quiz Completed', { description: 'Submitting your quiz...' });
				const res = await submitQuiz(activeQuiz?.id!);

				if (res.error) {
					toast('Error Finishing quiz', { description: res.error });
					setIsSubmitting(false);
					return;
				}

				if (res?.data) {
					const { data } = res;
					const stringifiedData = Object.fromEntries(
						Object.entries(data).map(([key, value]) => [key, String(value)])
					);
					const params = new URLSearchParams(stringifiedData);

					resetActiveQuiz();
					router.push(`/quiz/${activeQuiz?.id}/result?${params}`);
				}
			}
		} catch (error) {
			toast('Error submitting quiz', {
				description: (error as { message: string }).message,
			});
			setQuizError((error as { message: string }).message);
		} finally {
			setIsSubmitting(false);
		}
	}, [
		currentQuestionIdx,
		activeQuiz,
		resetActiveQuiz,
		router,
		nextQuestion,
		setIsSubmitting,
		setQuizError,
		isSubmitting,
	]);

	return {
		activeQuiz,
		currentQuestionIdx,
		handleFinishQuiz,
		isSubmitting,
		quizError: error?.message ?? null,
		quizStatus: status,
	};
}
