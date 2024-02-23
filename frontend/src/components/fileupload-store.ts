import { create } from 'zustand';

type State = {
	isDrawerOpen: boolean;
	openDrawer: () => void;
	closeDrawer: () => void;
};

export const useFileUploadStore = create<State>((set) => ({
	isDrawerOpen: false,
	openDrawer: () => set({ isDrawerOpen: true }),
	closeDrawer: () => set({ isDrawerOpen: false }),
}));
