import MaxWidthWrapper from '@/components/max-width-wrapper';
import { DrawerFileUpload } from '../../../../components/drawer-fileupload';
import { QuizeForm } from '../_components/quiz-form';

export default async function QuizGenerate() {
	// const data = await fetchDocuments({ pageParam: 1 });

	return (
		<>
			<MaxWidthWrapper className='mb-12 mt-14 sm:mt-20 flex flex-col items-center justify-center text-center'>
				<div className='bg-aix-frosted border border-aix-200 drop-shadow-sm px-[3rem] py-[2rem] rounded-3xl'>
					<QuizeForm />
					{/* <QuizeForm initialDocument={data} /> */}
				</div>
				<DrawerFileUpload />
			</MaxWidthWrapper>
		</>
	);
}
