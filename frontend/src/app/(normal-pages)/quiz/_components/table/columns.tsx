'use client';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Settings } from 'lucide-react';

export type Payment = {
	id: string;
	quizTitle: string;
	totalQuestions: number;
	createdAt: string;
	status: 'complete' | 'available';
};

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: 'quizTitle',
		header: () => <div className='text-left'>Title</div>,
		cell: ({ row }) => (
			<div className='capitalize'>{row.getValue('quizTitle')}</div>
		),
	},
	{
		accessorKey: 'totalQuestions',
		header: () => <div className='text-left'>Total Questions</div>,
		cell: ({ row }) => (
			<div className='lowercase'>{row.getValue('totalQuestions')}</div>
		),
	},
	{
		accessorKey: 'createdAt',
		header: () => <div className='text-left'>Created at</div>,
		cell: ({ row }) => (
			<div className='lowercase'>{row.getValue('createdAt')}</div>
		),
	},
	{
		accessorKey: 'status',
		header: () => <div className='text-left'>Status</div>,
		cell: ({ row }) => (
			<div className='capitalize'>{row.getValue('status')}</div>
		),
	},
	{
		id: 'actions',
		header: () => (
			<div className=''>
				<Settings className='h-4 w-4' />
				<span className='sr-only'>Actions</span>
			</div>
		),
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							className='h-8 w-8 p-0'
						>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(payment.id)}
						>
							Attempt Quiz
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View Feedback</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
