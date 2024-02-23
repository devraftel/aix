import { create } from 'zustand';

type State = {
	isDeleteQuizOpen: boolean;
	setIsDeleteQuizOpen: (isDeleteQuizOpen: boolean) => void;
};

export const useDeleteQuizStore = create<State>((set) => ({
	isDeleteQuizOpen: false,
	setIsDeleteQuizOpen: (isDeleteQuizOpen: boolean) => set({ isDeleteQuizOpen }),
}));
