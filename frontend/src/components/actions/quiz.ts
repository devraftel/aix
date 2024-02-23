'use server';
import { DifficultyLevel } from '@/app/(normal-pages)/quiz/_components/utils';
import { getBaseURL } from '@/lib/utils';

import { auth } from '@clerk/nextjs';

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
	});

	if (!response.ok) {
		console.log('GET /quiz failed', response.status, response.statusText);
		return {
			error: 'Unable to get quiz list',
		};
	}

	const json = await response.json();

	console.log('GET /quiz success', json);

	return { data: json };
}
