'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface QuestionButtonProps {
	question: string;
}

export const QuestionButton = ({ question }: QuestionButtonProps) => {
	const searchParams = useSearchParams();
	const qs = searchParams.get('qs');

	return (
		<Button
			className={cn(
				((!qs && question === '1') || qs === question) &&
					'bg-gray-950 text-white'
			)}
			variant={'outline'}
			size={'icon'}
		>
			<p>{question}</p>
		</Button>
	);
};
