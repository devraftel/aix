import MaxWidthWrapper from '@/components/max-width-wrapper';
import { DrawerDemo } from '../_components/fileupload';
import { QuizeForm } from '../_components/quiz-form';

export default function QuizGenerate() {
	return (
		<>
			<MaxWidthWrapper className='mb-12 mt-14 sm:mt-20 flex flex-col items-center justify-center text-center'>
				<div className='bg-gradient-to-br from-gray-200/80 to-gray-300/10 border border-gray-200 drop-shadow-sm flex flex-col items-center justify-center p-7 rounded-3xl'>
					<QuizeForm />
				</div>
				<DrawerDemo />
			</MaxWidthWrapper>
		</>
	);
}
