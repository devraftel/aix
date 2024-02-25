import { create } from 'zustand';

type State = {
	isFileDeleteOpen: boolean;
	setIsFileDeleteOpen: (isFileDeleteOpen: boolean) => void;
	fileId: string;
	setFileId: (fileId: string) => void;
};

export const useFileDeleteStore = create<State>((set) => ({
	isFileDeleteOpen: false,
	setIsFileDeleteOpen: (isFileDeleteOpen: boolean) => set({ isFileDeleteOpen }),
	fileId: '',
	setFileId: (fileId: string) => set({ fileId }),
}));
