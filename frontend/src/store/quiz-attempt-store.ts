import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuizAttempt {
	id: string;
	user_id: string;
	quiz_id: string;
	quiz_title: string;
	time_limit: string;
	time_start: string;
	total_points: number;
	questions: {
		id: string;
		question_text: string;
		question_type:
			| 'single_select_mcq'
			| 'multi_select_mcq'
			| 'open_text_question';
		points: number;
		mcq_options: {
			id: string;
			option_text: string;
		}[];
	}[];
}

type State = {
	quizAttempt: QuizAttempt | null;
	setQuizAttempt: (quizAttempt: QuizAttempt) => void;
	currentQuestionIndex: number;
	setCurrentQuestionIndex: (index: number) => void;
	submitQuestion: () => void;
	reset: () => void;
};

export const useQuizAttemptStore = create<State>()(
	persist(
		(set, get) => ({
			quizAttempt: null,
			setQuizAttempt: (quizAttempt: QuizAttempt) => set({ quizAttempt }),
			currentQuestionIndex: 0,
			setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
			submitQuestion: () =>
				set((state) => ({
					currentQuestionIndex: state.currentQuestionIndex + 1,
				})),
			reset: () => set({ quizAttempt: null, currentQuestionIndex: 0 }),
		}),
		{ name: 'quiz-attempt-store' }
	)
);
