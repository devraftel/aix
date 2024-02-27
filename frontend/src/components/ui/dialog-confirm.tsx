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

interface DialogConfirmProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmButtonText: string;
	cancelButtonText: string;
	isLoading: boolean;
	buttonVariant?: 'destructive' | 'default' | 'outline';
}

export function DialogConfirm({
	open,
	cancelButtonText,
	confirmButtonText,
	description,
	isLoading,
	onCancel,
	onConfirm,
	onOpenChange,
	title,
	buttonVariant = 'default',
}: DialogConfirmProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
			defaultOpen={false}
		>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold'>{title}</DialogTitle>
					<DialogDescription className='text-gray-700 mt-2'>
						{description}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<Button
						type='button'
						className='w-full border-gray-500 border'
						variant={'outline'}
						disabled={isLoading}
						onClick={() => {
							onCancel();
						}}
					>
						{cancelButtonText}
					</Button>
					<Button
						type='button'
						className='w-full'
						disabled={isLoading}
						isLoading={isLoading}
						onClick={() => {
							onConfirm();
						}}
						variant={buttonVariant}
					>
						{confirmButtonText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
