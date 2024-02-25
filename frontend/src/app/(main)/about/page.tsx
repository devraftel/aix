import MaxWidthWrapper from '@/components/max-width-wrapper';

const AboutPage = () => {
	return (
		<MaxWidthWrapper className='mb-20 sm:mb-36 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center h-[40rem]'>
			<h1 className='text-3xl sm:text-4xl md:text-5xl capitalize'>
				About Page
			</h1>
		</MaxWidthWrapper>
	);
};

export default AboutPage;
