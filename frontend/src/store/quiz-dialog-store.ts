import { create } from 'zustand';

type State = {
	isQuizDialogOpen: boolean;
	setQuizDialogStatus: (isQuizDialogOpen: boolean) => void;
	currentQuizTitle: string;
	setQuizTitle: (quizTitle: string) => void;
	currentQuizId: string;
	setQuizId: (quizId: string) => void;
};

export const useQuizDialogStore = create<State>((set) => ({
	isQuizDialogOpen: false,
	setQuizDialogStatus: (isQuizDialogOpen: boolean) => set({ isQuizDialogOpen }),
	currentQuizTitle: '',
	setQuizTitle: (currentQuizTitle: string) => set({ currentQuizTitle }),
	currentQuizId: '',
	setQuizId: (currentQuizId: string) => set({ currentQuizId }),
}));
