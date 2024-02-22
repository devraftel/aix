import MaxWidthWrapper from '@/components/max-width-wrapper';
import { QuizListTable } from './_components/table/data-table';

export default function QuizList() {
	return (
		<>
			<MaxWidthWrapper className='mb-12 mt-14 sm:mt-20'>
				<h1 className='font-semibold text-2xl text-left mb-4'>Quiz List</h1>
				<hr className='mb-6 w-[20%]' />
				<QuizListTable />
			</MaxWidthWrapper>
		</>
	);
}
