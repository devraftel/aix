'use client';

import { submitQuiz } from '@/components/actions/quiz';
import { useQuizAttemptStore } from '@/store/quiz-attempt-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function CountdownClock() {
	const { quizAttempt, reset } = useQuizAttemptStore();
	const [remainingTime, setRemainingTime] = useState(0);
	const router = useRouter();

	useEffect(() => {
		if (!quizAttempt) {
			return;
		}

		const startTime = new Date(quizAttempt.time_start);
		const [limitHours, limitMinutes, limitSeconds] = quizAttempt.time_limit
			.split(':')
			.map(Number);
		const endTime = new Date(startTime.getTime());
		endTime.setHours(endTime.getHours() + limitHours);
		endTime.setMinutes(endTime.getMinutes() + limitMinutes);
		endTime.setSeconds(endTime.getSeconds() + limitSeconds);

		// Immediately set remaining time
		setRemainingTime(endTime.getTime() - Date.now());

		// Update the remaining time every second
		const intervalId = setInterval(async () => {
			const newRemainingTime = endTime.getTime() - Date.now();
			setRemainingTime(newRemainingTime);

			if (newRemainingTime <= 0) {
				clearInterval(intervalId);
				const res = await submitQuiz(quizAttempt.id);

				if (res.error) {
					console.error('Error submitting quiz:', res.error);
				} else if (res.data) {
					console.log('Quiz submitted:', res.data);
					router.push(`/quiz/${quizAttempt.quiz_id}`);
					reset();
				}
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [quizAttempt, reset, router]);

	if (!quizAttempt || remainingTime <= 0) {
		return null;
	}

	// Calculate remaining hours, minutes, and seconds
	const remainingHours = Math.floor(remainingTime / 3600000);
	const remainingMinutes = Math.floor((remainingTime % 3600000) / 60000);
	const remainingSeconds = Math.floor((remainingTime % 60000) / 1000);

	return (
		<div className='flex items-center space-x-4 text-2xl font-semibold'>
			{remainingHours > 0 && (
				<>
					<div className='rounded-lg border w-10 h-10 flex items-center justify-center'>
						{remainingHours.toString().padStart(2, '0')}
					</div>
					<span className='text-gray-500 dark:text-gray-400'>:</span>
				</>
			)}
			<div className='rounded-lg border w-10 h-10 flex items-center justify-center'>
				{remainingMinutes.toString().padStart(2, '0')}
			</div>
			<span className='text-gray-500 dark:text-gray-400'>:</span>
			<div className='rounded-lg border w-10 h-10 flex items-center justify-center'>
				{remainingSeconds.toString().padStart(2, '0')}
			</div>
		</div>
	);
}
