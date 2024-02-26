'use client';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteQuizStore } from '@/store/delete-quiz';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteQ } from './actions/attempt';

export function DeleteQuiz() {
	const { isDeleteQuizOpen, setIsDeleteQuizOpen } = useDeleteQuizStore();
	const [deleting, setDeleting] = useState(false);
	const searchparams = useSearchParams();
	const quizId = searchparams.get('delete');
	const router = useRouter();

	const handleDelete = async () => {
		if (!quizId) {
			toast('Quiz not deleted', {
				description: 'Quiz not found. Please try again',
			});
			return;
		}
		try {
			setDeleting(true);
			const res = await deleteQ(quizId);
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
			setDeleting(false);
		}
	};

	return (
		<Dialog
			open={isDeleteQuizOpen}
			onOpenChange={setIsDeleteQuizOpen}
			defaultOpen={false}
		>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold'>
						Delete Quiz Confirmation
					</DialogTitle>
					<DialogDescription className='text-gray-700 mt-2'>
						You are about to delete this quiz. This action cannot be undone.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						type='button'
						className='w-full border-gray-500 border'
						variant={'outline'}
						onClick={() => {
							setIsDeleteQuizOpen(!isDeleteQuizOpen);
						}}
					>
						Cancel
					</Button>
					<Button
						type='button'
						className='w-full'
						variant={'destructive'}
						onClick={handleDelete}
						isLoading={deleting}
						disabled={deleting}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
