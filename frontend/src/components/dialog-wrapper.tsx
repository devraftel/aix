'use client';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useDeleteQuizStore } from '@/store/delete-quiz';
import { useQuizStartStore } from '@/store/quiz-start-store';

import { deleteQ } from './actions/attempt';
import { DialogConfirm } from './ui/dialog-confirm';

import { QUERY_KEY } from '@/lib/constants';
import { useFileDeleteStore } from '@/store/filedeletestore';

export const DialogWrapper = () => {
	const { isQuizStartOpen, setIsQuizStartOpen, quizId } = useQuizStartStore();
	const { isDeleteQuizOpen, setIsDeleteQuizOpen } = useDeleteQuizStore();
	const { isFileDeleteOpen, setIsFileDeleteOpen, fileId } =
		useFileDeleteStore();

	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);

	const router = useRouter();
	const pathname = usePathname();
	const searchParam = useSearchParams();
	const queryClient = useQueryClient();

	const quiz_id = searchParam.get('delete');

	const id = pathname.split('/').pop();

	const handleAttempt = () => {
		router.push(`/quiz/${quizId || id}/attempt`);
		setIsQuizStartOpen(!isQuizStartOpen);
	};

	const handleQuizDelete = async () => {
		try {
			setIsDeleting(true);

			if (!quiz_id) {
				toast('Quiz not deleted', {
					description: 'Quiz not found. Please try again',
				});
				return;
			}
			const res = await deleteQ(quiz_id);

			if (res.error) {
				toast('Quiz not deleted', {
					description: res.error,
				});
			} else {
				toast('Quiz Deleted', { description: 'Quiz has been deleted' });
				router.push('/quiz');
				setIsDeleteQuizOpen(!isDeleteQuizOpen);
			}
		} catch (error) {
			toast('Quiz not deleted', {
				description: 'An error occurred. Please try again',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const handleFileDelete = async () => {
		try {
			setIsDeletingFile(true);

			const response = await fetch(`/api/file/${fileId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				toast.error('Failed to delete the file.', {
					description: 'Please try again later.',
				});
				return;
			}

			if (response.status === 200) {
				toast.success('File deleted successfully');

				queryClient.invalidateQueries({
					queryKey: [QUERY_KEY.DOCUMENTS, fileId],
				});
				setIsFileDeleteOpen(!isFileDeleteOpen);
			}
		} catch (error) {
			console.log('FileDeleteDialog', error);
			throw new Error('Failed to delete the file');
		} finally {
			setIsDeletingFile(false);
		}
	};

	return (
		<>
			<DialogConfirm
				open={isQuizStartOpen}
				onOpenChange={setIsQuizStartOpen}
				title='Quiz Initialization'
				description='You are about to start the quiz. Ensure you are ready as the timer will start immediately.'
				cancelButtonText='Cancel'
				confirmButtonText='Start'
				isLoading={false}
				onCancel={() => {
					setIsQuizStartOpen(!isQuizStartOpen);
				}}
				onConfirm={handleAttempt}
			/>

			<DialogConfirm
				open={isDeleteQuizOpen}
				onOpenChange={setIsDeleteQuizOpen}
				title='Delete Quiz Confirmation'
				description='You are about to delete this quiz. This action cannot be undone.'
				cancelButtonText='Cancel'
				confirmButtonText='Delete'
				buttonVariant='destructive'
				isLoading={isDeleting}
				onConfirm={handleQuizDelete}
				onCancel={() => {
					setIsDeleteQuizOpen(!isDeleteQuizOpen);
				}}
			/>

			<DialogConfirm
				open={isFileDeleteOpen}
				onOpenChange={setIsFileDeleteOpen}
				title='Delete File'
				description={`You are about to delete the file ${fileId}. Are you sure you want to delete the file?`}
				cancelButtonText='Cancel'
				confirmButtonText='Delete'
				buttonVariant='destructive'
				isLoading={isDeletingFile}
				onConfirm={handleFileDelete}
				onCancel={() => {
					setIsFileDeleteOpen(!isFileDeleteOpen);
				}}
			/>
		</>
	);
};
