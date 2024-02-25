'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
interface QuestionButtonProps {
	question: string;
	question_id: string;
}

export const QuestionButton = ({
	question,
	question_id,
}: QuestionButtonProps) => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const qs = searchParams.get('qs');

	return (
		<Button
			className={
				cn()
				// ((!qs && question === '1') || qs === question) &&
				// 	'bg-gray-950 text-white'
			}
			variant={'outline'}
			size={'icon'}
			onClick={() => {
				router.push(pathname + `#${question_id}`, { scroll: true });
			}}
		>
			<p>{question}</p>
		</Button>
	);
};

{
	/*

<Link
			href={{
				pathname: pathname + `#${question_id}`,
				query: { qs: question === '1' ? undefined : question },
			}}
			target='_self'
			className={cn(
				buttonVariants({
					variant: 'outline',
					size: 'icon',
					className: cn(
						((!qs && question === '1') || qs === question) &&
							'bg-gray-950 text-white'
					),
				})
			)}
		>
			{question}
		</Link>
*/
}
