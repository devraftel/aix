// export function CountdownClock() {
// 	return (
// 		<div className='flex items-center space-x-4 text-2xl font-semibold'>
// 			<div className='rounded-lg border w-10 h-10 flex items-center justify-center'>
// 				02
// 			</div>
// 			<span className='text-gray-500 dark:text-gray-400'>:</span>
// 			<div className='rounded-lg border w-10 h-10 flex items-center justify-center'>
// 				48
// 			</div>
// 			<span className='text-gray-500 dark:text-gray-400'>:</span>
// 			<div className='rounded-lg border w-10 h-10 flex items-center justify-center'>
// 				15
// 			</div>
// 		</div>
// 	);
// }

interface CountdownClockProps {
	hours?: number;
	minutes?: number;
	seconds?: number;
}

export function CountdownClock({
	hours,
	minutes,
	seconds,
}: CountdownClockProps) {
	return (
		<div className='flex items-center space-x-4 text-2xl font-semibold'>
			{hours !== undefined && (
				<>
					<div className='rounded-lg border w-10 h-10 flex items-center justify-center'>
						{hours.toString().padStart(2, '0')}
					</div>
					<span className='text-gray-500 dark:text-gray-400'>:</span>
				</>
			)}
			<div className='rounded-lg border w-10 h-10 flex items-center justify-center'>
				{minutes?.toString().padStart(2, '0') || '00'}
			</div>
			<span className='text-gray-500 dark:text-gray-400'>:</span>
			<div className='rounded-lg border w-10 h-10 flex items-center justify-center'>
				{seconds?.toString().padStart(2, '0') || '00'}
			</div>
		</div>
	);
}
