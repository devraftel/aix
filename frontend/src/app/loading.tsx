import { LoaderAnimation } from '@/components/loader-animation';

const loading = () => {
	return (
		<div className='flex flex-col flex-1 items-center justify-center min-h-screen h-full'>
			<LoaderAnimation />
		</div>
	);
};

export default loading;
