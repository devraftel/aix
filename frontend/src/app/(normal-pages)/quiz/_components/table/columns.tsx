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
import Link from 'next/link';

export type QuizList = {
	id: string;
	quizTitle: string;
	totalQuestions: number;
	total_points: number;
	time_limit: string;
	status: 'complete' | 'available';
};

export const columns: ColumnDef<QuizList>[] = [
	{
		accessorKey: 'quizTitle',
		header: () => <div className='text-left'>Title</div>,
		cell: ({ row }) => {
			return (
				<div className='capitalize hover:underline underline-offset-2'>
					<Link href={`/quiz/${row.original.id}`}>
						{row.getValue('quizTitle')}
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: 'totalQuestions',
		header: () => <div className='text-left'>Total Questions</div>,
		cell: ({ row }) => (
			<div className='lowercase'>{row.getValue('totalQuestions')}</div>
		),
	},
	{
		accessorKey: 'total_points',
		header: () => <div className='text-left'>Points</div>,
		cell: ({ row }) => (
			<div className='lowercase'>{row.getValue('total_points')}</div>
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
		accessorKey: 'time_limit',
		header: () => <div className='text-left'>Time Limit</div>,
		cell: ({ row }) => (
			<div className='capitalize'>{row.getValue('time_limit')}</div>
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
			const quiz = row.original;

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
						<DropdownMenuItem>
							<Link
								href={`/quiz/${quiz.id}`}
								className=''
							>
								View Quiz
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link
								href={`/quiz/${quiz.id}/attempt`}
								className=''
							>
								Attempt Quiz
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link
								href={`/quiz/${quiz.id}/feedback`}
								className=''
							>
								Check Feedback
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
