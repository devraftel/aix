import { LoaderAnimation } from '@/components/loader-animation';

const loading = () => {
	return (
		<div className='flex flex-col flex-1 items-center justify-center min-h-screen h-full space-y-2 md:space-y-4'>
			<h1 className='text-2xl md:text-3xl'>Loading Results</h1>
			<LoaderAnimation />
		</div>
	);
};

export default loading;
