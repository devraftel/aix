import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SourceCardProps {
	link: string;
	title: string;
}

export const SourceCard = ({ link, title }: SourceCardProps) => {
	return (
		<Link
			href={link}
			className='w-full h-full group transition-all duration-300 ease-in-out'
		>
			<Card className='aspect-square max-w-[160px] max-h-[160px] shadow-md drop-shadow-md rounded-3xl relative z-10'>
				<Image
					src='https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=1136&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
					alt='source'
					className='object-cover rounded-3xl'
					fill
				/>
				<div className='absolute bg-gray-950/90 bottom-0 left-0 right-0 rounded-3xl'>
					<CardHeader className='px-4 py-4'>
						<Link
							href={link}
							className={cn(
								buttonVariants({
									size: 'icon',
									className:
										'-top-4 absolute right-2 md:right-4 p-2 bg-gray-50/95 rounded-full group-hover:bg-gray-100/90',
								})
							)}
						>
							<LinkIcon className='h-4 w-4 text-black' />
						</Link>
						<CardTitle className='text-[15px] font-bold text-gray-50'>
							{title.length > 20 ? title.slice(0, 20) + '...' : title}
						</CardTitle>
					</CardHeader>
				</div>
			</Card>
		</Link>
	);
};
