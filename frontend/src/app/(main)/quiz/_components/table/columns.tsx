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
import { formatSeconds } from '@/lib/utils';
import { useDeleteQuizStore } from '@/store/delete-quiz';
import { useQuizDialogStore } from '@/store/quiz-dialog-store';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export type QuizList = {
	id: string;
	quizTitle: string;
	totalQuestions: number;
	total_points: number;
	time_limit: string;
	status: 'complete' | 'available';
};

const ActionCell = ({ row }: { row: Row<QuizList> }) => {
	const quiz = row.original;
	const { isQuizDialogOpen, setQuizDialogStatus, setQuizId } =
		useQuizDialogStore();
	const { isDeleteQuizOpen, setIsDeleteQuizOpen } = useDeleteQuizStore();
	const router = useRouter();
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
				<DropdownMenuItem
					onClick={() => {
						setQuizId(quiz.id);
						setQuizDialogStatus(!isQuizDialogOpen);
					}}
				>
					Attempt Quiz
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
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						router.push(`/quiz?delete=${quiz.id}`);
						setIsDeleteQuizOpen(!isDeleteQuizOpen);
					}}
				>
					Delete Quiz
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const columns: ColumnDef<QuizList>[] = [
	{
		accessorKey: 'quizTitle',
		header: () => <div className='text-left'>Title</div>,
		cell: ({ row }) => {
			return (
				<Link
					href={`/quiz/${row.original.id}`}
					className='capitalize hover:underline underline-offset-2'
				>
					{row.getValue('quizTitle')}
				</Link>
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
		cell: ({ row }) => {
			const time = row.getValue('time_limit') as string;
			const _time = formatSeconds(time);

			return <div className='capitalize'>{_time}</div>;
		},
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
		cell: ActionCell,
		// 	cell: ({ row }) => {
		// 		const quiz = row.original;

		// 		return (
		// 			<DropdownMenu>
		// 				<DropdownMenuTrigger asChild>
		// 					<Button
		// 						variant='ghost'
		// 						className='h-8 w-8 p-0'
		// 					>
		// 						<span className='sr-only'>Open menu</span>
		// 						<MoreHorizontal className='h-4 w-4' />
		// 					</Button>
		// 				</DropdownMenuTrigger>
		// 				<DropdownMenuContent align='end'>
		// 					<DropdownMenuLabel>Actions</DropdownMenuLabel>
		// 					<DropdownMenuItem>
		// 						<Link
		// 							href={`/quiz/${quiz.id}`}
		// 							className=''
		// 						>
		// 							View Quiz
		// 						</Link>
		// 					</DropdownMenuItem>
		// 					<DropdownMenuSeparator />
		// 					<DropdownMenuItem>
		// 						<Link href={`/quiz/${quiz.id}`}>Attempt Quiz</Link>
		// 					</DropdownMenuItem>
		// 					<DropdownMenuSeparator />
		// 					<DropdownMenuItem>
		// 						<Link
		// 							href={`/quiz/${quiz.id}/feedback`}
		// 							className=''
		// 						>
		// 							Check Feedback
		// 						</Link>
		// 					</DropdownMenuItem>
		// 				</DropdownMenuContent>
		// 			</DropdownMenu>
		// 		);
		// 	},
		// },
	},
];
