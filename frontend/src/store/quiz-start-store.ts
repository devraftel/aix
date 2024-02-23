import { create } from 'zustand';

type State = {
	isQuizStartOpen: boolean;
	setIsQuizStartOpen: (isQuizStartOpen: boolean) => void;
	quizTitle: string;
	setQuizTitle: (quizTitle: string) => void;
	quizId: string;
	setQuizId: (quizId: string) => void;
};

export const useQuizStartStore = create<State>((set) => ({
	isQuizStartOpen: false,
	setIsQuizStartOpen: (isQuizStartOpen: boolean) => set({ isQuizStartOpen }),
	quizTitle: '',
	setQuizTitle: (quizTitle: string) => set({ quizTitle }),
	quizId: '',
	setQuizId: (quizId: string) => set({ quizId }),
}));
