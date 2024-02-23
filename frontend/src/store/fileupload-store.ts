import { create } from 'zustand';

type State = {
	isDrawerOpen: boolean;
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
};

export const useFileUploadStore = create<State>((set) => ({
	isDrawerOpen: false,
	setIsDrawerOpen: (isDrawerOpen: boolean) => set({ isDrawerOpen }),
}));
