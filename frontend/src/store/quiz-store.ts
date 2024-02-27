import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Quiz } from '@/type/quiz';

type State = {
	activeQuiz: Quiz | null;
	setActiveQuiz: (activeQuiz: Quiz) => void;
	currentQuestionIdx: number;
	updateCurrentQuestionIdx: (index: number) => void;
	nextQuestion: () => void;
	resetActiveQuiz: () => void;
	isSubmitting: boolean;
	quizError: string | null;
	setIsSubmitting: (isSubmitting: boolean) => void;
	setQuizError: (error: string | null) => void;
};

export const useQuizStore = create<State>()(
	persist(
		(set, get) => ({
			activeQuiz: null,
			setActiveQuiz: (activeQuiz: Quiz) => set({ activeQuiz }),
			isSubmitting: false,
			quizError: null,
			setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
			setQuizError: (error) => set({ quizError: error }),
			currentQuestionIdx: 0,
			updateCurrentQuestionIdx: (index) => set({ currentQuestionIdx: index }),
			nextQuestion: () =>
				set((state) => ({
					currentQuestionIdx: state.currentQuestionIdx + 1,
				})),
			resetActiveQuiz: () => set({ activeQuiz: null, currentQuestionIdx: 0 }),
		}),
		{ name: 'quiz-attempt-store' }
	)
);
