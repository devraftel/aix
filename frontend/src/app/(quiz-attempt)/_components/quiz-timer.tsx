'use client';
import { Clock } from 'lucide-react';
import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

interface QuizTimerProps {
	startTime: string;
	totalTime: number;
	onExpire?: () => void;
}

const QuizTimer = ({ startTime, totalTime, onExpire }: QuizTimerProps) => {
	const expiryTimestamp = new Date(
		new Date(startTime).getTime() + totalTime * 1000
	);

	const { seconds, minutes, hours, isRunning, start, pause, resume, restart } =
		useTimer({
			expiryTimestamp,
			onExpire: () => {
				onExpire && onExpire();
				console.warn('Timer expired');
			},
		});

	useEffect(() => {
		const newExpiryTimestamp = new Date(
			new Date().getTime() + totalTime * 1000
		);
		restart(newExpiryTimestamp);
	}, [startTime, totalTime, restart]);

	return (
		<div className='flex space-x-4 items-center justify-center'>
			<Clock />
			<div className='flex px-[2rem] py-[0.5rem] bg-aix-50 border border-aix-100 drop-shadow rounded-full backdrop-blur-md space-x-2'>
				<p className='font-semibold font-roboto text-aix-900'>
					{hours > 0 && <span> {hours} :</span>}
					{<span className='font-semibold'> {minutes}</span>}
					{<span className='font-semibold'> : {seconds}</span>}
				</p>
			</div>
		</div>
	);
};

export { QuizTimer };
