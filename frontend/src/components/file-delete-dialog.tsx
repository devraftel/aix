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
import { QUERY_KEY } from '@/lib/constants';
import { useFileDeleteStore } from '@/store/filedeletestore';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export function FileDelteDialog() {
	const { isFileDeleteOpen, setIsFileDeleteOpen, fileId } =
		useFileDeleteStore();
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setIsLoading(true);
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
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={isFileDeleteOpen}
			onOpenChange={setIsFileDeleteOpen}
			defaultOpen={false}
		>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold'>
						Delete File
					</DialogTitle>
					<DialogDescription className='text-gray-700 mt-2'>
						You are about to delete the file {fileId}. Are you sure you want to
						delete the file?
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						type='button'
						className='w-full border-gray-500 border'
						variant={'outline'}
						onClick={() => {
							setIsFileDeleteOpen(!isFileDeleteOpen);
						}}
					>
						Cancel
					</Button>
					<Button
						type='button'
						className='w-full'
						variant={'destructive'}
						onClick={() => {
							handleDelete();
						}}
						disabled={isLoading}
						isLoading={isLoading}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
