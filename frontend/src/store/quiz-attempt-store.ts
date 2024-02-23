import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizAttempt {
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
};

export const useQuizAttemptStore = create<State>()(
	persist(
		(set, get) => ({
			quizAttempt: null,
			setQuizAttempt: (quizAttempt: QuizAttempt) => set({ quizAttempt }),
		}),
		{ name: 'quiz-attempt-store' }
	)
);
