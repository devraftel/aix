'use server';
import { DifficultyLevel } from '@/app/(normal-pages)/quiz/_components/utils';
import { getBaseURL } from '@/lib/utils';
import dayjs from 'dayjs';

import { auth } from '@clerk/nextjs';
import { revalidateTag } from 'next/cache';

export interface QuizGenerate {
	title: string;
	time_limit: string;
	total_questions_to_generate: number;
	questions_type: string[];
	difficulty: DifficultyLevel;
	user_prompt: string;
	file_ids: string[];
}

export interface QuizGenerateReponse {
	id: string;
	title: string;
	has_user_attempted: boolean;
	time_limit: string;
	total_points: number;
	total_questions_count: number;
}

export async function createQuiz(data: QuizGenerate): Promise<{
	error?: string;
	data?: QuizGenerateReponse;
}> {
	console.log('Creating quiz', data);

	if (!data) {
		return { error: 'User data is required to create a quiz.' };
	}
	const { userId, sessionId } = auth();

	if (!userId) {
		return { error: 'User is not logged in' };
	}

	const baseUrl = getBaseURL();

	const response = await fetch(`${baseUrl}/quiz/generate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sessionId}`,
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		console.log(
			'POST /quiz/generate failed',
			response.status,
			response.statusText
		);
		return {
			error: 'Unable to create quiz',
		};
	}

	const json = await response.json();

	console.log('POST /quiz/generate success', json);

	revalidateTag('quizList');

	return { data: json };
}

export async function getQuizList(): Promise<{
	error?: string;
	data?: {
		total: number;
		next_page: string;
		prev_page: string;
		data: QuizGenerateReponse[];
	};
}> {
	const { userId, sessionId } = auth();
	if (!userId) {
		return { error: 'User is not logged in' };
	}

	const baseUrl = getBaseURL();

	const response = await fetch(`${baseUrl}/quiz`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${sessionId}`,
		},
		next: {
			tags: ['quizList'],
		},
	});

	if (!response.ok) {
		console.log('GET /quiz failed', response.status, response.statusText);
		return {
			error: 'Unable to get quiz list',
		};
	}

	const json = await response.json();

	console.log('GET /quiz success', json);

	json.data = json.data.map((quiz: QuizGenerateReponse) => {
		const timeLimit = convertTime(quiz.time_limit);
		console.log('Time Limit', timeLimit);
		quiz.time_limit = timeLimit;
		return quiz;
	});

	return { data: json };
}

export async function getQuiz(quizId: string): Promise<{
	error?: string;
	data?: QuizGenerateReponse;
}> {
	if (!quizId) {
		return { error: 'Quiz ID is required to get a quiz.' };
	}

	const { userId, sessionId } = auth();
	if (!userId) {
		return { error: 'User is not logged in' };
	}

	const baseUrl = getBaseURL();

	const response = await fetch(`${baseUrl}/quiz/${quizId}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${sessionId}`,
		},
	});

	if (!response.ok) {
		console.log('GET /quiz/:id failed', response.status, response.statusText);
		return {
			error: 'Unable to get quiz',
		};
	}

	const json = (await response.json()) as QuizGenerateReponse;

	console.log('GET /quiz/:id success', json);

	const timeLimit = convertTime(json.time_limit);

	json.time_limit = timeLimit;

	return { data: json };
}

const convertTime = (time: string) => {
	let totalSeconds = 0;
	const hoursMatch = time.match(/(\d+)H/);
	const minutesMatch = time.match(/(\d+)M/);
	const secondsMatch = time.match(/(\d+)S/);

	if (hoursMatch) {
		totalSeconds += Number(hoursMatch[1]) * 3600;
	}

	if (minutesMatch) {
		totalSeconds += Number(minutesMatch[1]) * 60;
	}

	if (secondsMatch) {
		totalSeconds += Number(secondsMatch[1]);
	}

	const date = dayjs.unix(totalSeconds);
	return `${date.format('HH:mm:ss')}`;
};

interface QuizAttempt {
	id: string;
	user_id: string;
	quiz_id: string;
	quiz_title: string;
	time_limit: string;
	time_start: string;
	total_points: number;
	questions: {
		id: string;
		question_text: string;
		question_type:
			| 'single_select_mcq'
			| 'multi_select_mcq'
			| 'open_text_question';
		points: number;
		mcq_options: {
			id: string;
			option_text: string;
		}[];
	}[];
}

export async function attemptQuiz(quizId: string): Promise<{
	error?: string;
	data?: QuizAttempt;
}> {
	if (!quizId) {
		return { error: 'Quiz ID is required to attempt a quiz.' };
	}

	const { userId, sessionId } = auth();
	if (!userId) {
		return { error: 'User is not logged in' };
	}

	const baseUrl = getBaseURL();

	const response = await fetch(`${baseUrl}/quiz-attempt/create/${quizId}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${sessionId}`,
		},
	});

	if (!response.ok) {
		console.log(
			'POST /quiz-attempt/:id failed',
			response.status,
			response.statusText
		);
		return {
			error: 'Unable to attempt quiz',
		};
	}

	const json = await response.json();

	console.log('POST /quiz-attempt/:id success', json);

	return { data: json };
}
