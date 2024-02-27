'use server';
import { convertISODurationToSeconds, getBaseURL } from '@/lib/utils';

import {
	Attempt,
	FinishResponse,
	Generate,
	GenerateReponse,
} from '@/type/quiz';
import { auth } from '@clerk/nextjs';
import { revalidateTag } from 'next/cache';

export async function generateQuiz(data: Generate): Promise<{
	error?: string;
	data?: GenerateReponse;
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
	error?: {
		message: string;
		status: number;
	};
	data?: {
		total: number;
		next_page: string;
		prev_page: string;
		data: GenerateReponse[];
	};
}> {
	const { userId, sessionId } = auth();
	if (!userId) {
		return {
			error: {
				message: 'User is not logged in',
				status: 401,
			},
		};
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

	if (response.status === 404) {
		console.log('GET /quiz failed', response.status, response.statusText);
		return {
			error: {
				message: 'No quizzes found. Please create a quiz to get started',
				status: 404,
			},
		};
	} else if (!response.ok) {
		console.log('GET /quiz failed', response.status, response.statusText);
		return {
			error: {
				message: 'Unable to get quiz list',
				status: response.status,
			},
		};
	}

	const json = await response.json();

	json.data = json.data.map((quiz: GenerateReponse) => {
		const timeLimit = convertISODurationToSeconds(quiz.time_limit).toString();

		quiz.time_limit = timeLimit;
		return quiz;
	});
	console.log('GET /quiz success', json);

	return { data: json };
}

export async function getQuiz(quizId: string): Promise<{
	error?: string;
	data?: GenerateReponse;
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

	const json = (await response.json()) as GenerateReponse;

	const timeLimit = convertISODurationToSeconds(json.time_limit).toString();

	json.time_limit = timeLimit;

	console.log('GET /quiz/:id success', json);

	return { data: json };
}

export async function attemptQuiz(quizId: string): Promise<{
	error?: string;
	data?: Attempt;
}> {
	// return {
	// 	data: attemptResponse,
	// };

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

	const time_limit = convertISODurationToSeconds(json.time_limit).toString();

	json.time_limit = time_limit;

	console.log('POST /quiz-attempt/:id success', json);

	return { data: json };
}

export async function saveAnswer({
	attemptId,
	questionId,
	questionType,
	answerText,
	selectedOptions,
}: {
	attemptId: string;
	questionId: string;
	questionType: 'single_select_mcq' | 'multi_select_mcq' | 'open_text_question';
	answerText?: string;
	selectedOptions?: string[];
}): Promise<{ data?: any; error?: string }> {
	if (!attemptId) {
		return { error: 'Attempt ID is required to submit an answer.' };
	} else if (!questionId) {
		return { error: 'Question ID is required to submit an answer.' };
	} else if (!questionType) {
		return { error: 'Question Type is required to submit an answer.' };
	}

	const { userId, sessionId } = auth();
	if (!userId) {
		return { error: 'User is not logged in' };
	}

	const baseUrl = getBaseURL();

	const payload: any = {
		quiz_attempt_id: attemptId,
		question_id: questionId,
		question_type: questionType,
	};

	if (
		questionType === 'single_select_mcq' ||
		questionType === 'multi_select_mcq'
	) {
		payload.selected_options_ids = selectedOptions;
	}

	if (questionType === 'open_text_question') {
		payload.answer_text = answerText;
	}

	console.log('Submitting answer', payload);

	const response = await fetch(`${baseUrl}/quiz-attempt/answer_slot/save`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sessionId}`,
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		console.log(
			'POST /quiz-attempt/answer_slot/save failed',
			response.status,
			response.statusText
		);
		return { error: 'Unable to submit answer' };
	}

	const json = await response.json();

	console.log('POST /quiz-attempt/answer_slot/save success', json);

	return { data: json };
}

export async function submitQuiz(
	attemptId: string
): Promise<{ data?: FinishResponse; error?: string }> {
	if (!attemptId) {
		return { error: 'Attempt ID is required to submit a quiz.' };
	}

	const { userId, sessionId } = auth();
	if (!userId) {
		return { error: 'User is not logged in' };
	}

	const baseUrl = getBaseURL();

	const response = await fetch(`${baseUrl}/quiz-attempt/${attemptId}/finish`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${sessionId}`,
		},
	});

	if (!response.ok) {
		console.log(
			'POST /quiz-attempt/submit/:id/finish failed',
			response.status,
			response.statusText
		);
		return { error: 'Unable to submit quiz' };
	}

	const json = await response.json();

	console.log('POST /quiz-attempt/submit/:id/finish success', json);

	return { data: json };
}

export async function deleteQuiz(quizId: string): Promise<{ error?: string }> {
	if (!quizId) {
		return { error: 'Quiz ID is required to delete a quiz.' };
	}

	const { userId, sessionId } = auth();

	if (!userId) {
		return { error: 'User is not logged in' };
	}

	console.log('Session', sessionId);

	const baseUrl = getBaseURL();

	const response = await fetch(`${baseUrl}/quiz/${quizId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${sessionId}`,
		},
	});

	if (!response.ok) {
		console.log(
			'DELETE /quiz/:id failed',
			response.status,
			response.statusText
		);
		return { error: 'Unable to delete quiz' };
	}

	console.log('DELETE /quiz/:id success');

	revalidateTag('quizList');

	return {};
}

export const quizFeedback = async (
	quizId: string
): Promise<{
	data?: any;
	error?: string;
}> => {
	if (!quizId) {
		return { error: 'Quiz ID is required to get feedback.' };
	}

	// return { data: dummyfeedback };

	const { userId, sessionId } = auth();
	if (!userId) {
		return { error: 'User is not logged in' };
	}

	console.log('Session', sessionId);

	const baseUrl = getBaseURL();

	const response = await fetch(
		// `${baseUrl}/quiz-attempt/${quizId}/graded`,
		`${baseUrl}/quiz-attempt/user/${quizId}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${sessionId}`,
			},
		}
	);

	if (!response.ok) {
		console.log(
			'GET /quiz/:id/feedback failed',
			response.status,
			response.statusText
		);
		return { error: 'Unable to get quiz feedback' };
	}

	const json = await response.json();

	console.log('GET /quiz/:id/feedback success', json);

	return { data: json };
};

const attemptResponse: Attempt = {
	id: '018de9ee-7fe1-77f1-bb7c-c263209c58b4',
	user_id: 'user_2cg53hbMtFaIpp9aK0FkC0rSE4w',
	quiz_title: 'Design Cheatsheet',
	quiz_id: '018de9ee-00ba-7161-87d9-b8b2491fef48',
	time_limit: '1800',
	time_start: '2024-02-27T09:38:58.145302',
	total_points: 5,
	questions: [
		{
			id: '018de9ee-5a4a-7044-9a47-03c019dbdb6e',
			question_text:
				'What is the abbreviation for Open, High, Low, Close in chart analysis?',
			question_type: 'single_select_mcq',
			points: 1,
			mcq_options: [
				{
					id: '018de9ee-5a4a-7044-9a47-OHLC',
					option_text: 'OHLC',
				},
				{
					id: '018de9ee-5a4a-7044-9a47-HLOC',
					option_text: 'HLOC',
				},
				{
					id: '018de9ee-5a4a-7044-9a47-OLHC',
					option_text: 'OLHC',
				},
				{
					id: '018de9ee-5a4a-7044-9a47-LOHC',
					option_text: 'LOHC',
				},
			],
		},
		{
			id: '018de9ee-5a4b-705a-921f-fb2cc76c45ed',
			question_text:
				"What does the acronym 'EA' stand for in the context of trading?",
			question_type: 'single_select_mcq',
			points: 1,
			mcq_options: [
				{
					id: '018de9ee-5a4b-705a-921f-Advisor',
					option_text: 'Expert Advisor',
				},
				{
					id: '018de9ee-5a4b-705a-921f-Analysis',
					option_text: 'Expert Analysis',
				},
				{
					id: '018de9ee-5a4b-705a-921f-Account',
					option_text: 'Expert Account',
				},
				{
					id: '018de9ee-5a4b-705a-921f-Algorithm',
					option_text: 'Expert Algorithm',
				},
			],
		},
		{
			id: '018de9ee-5a4b-7e73-b256-ee6f5e06f72a',
			question_text: "In trading, what does the abbreviation 'SL' refer to?",
			question_type: 'single_select_mcq',
			points: 1,
			mcq_options: [
				{
					id: '018de9ee-5a4b-7e73-b256-Loss',
					option_text: 'Stop Loss',
				},
				{
					id: '018de9ee-5a4b-7e73-b256-Limit',
					option_text: 'Stop Limit',
				},
				{
					id: '018de9ee-5a4b-7e73-b256-Level',
					option_text: 'Stop Level',
				},
				{
					id: '018de9ee-5a4b-7e73-b256-Line',
					option_text: 'Stop Line',
				},
			],
		},
		{
			id: '018de9ee-5a4c-7bce-a3d4-f127ff6a910d',
			question_text:
				"What does 'FX' stand for in the context of trading and finance?",
			question_type: 'single_select_mcq',
			points: 1,
			mcq_options: [
				{
					id: '018de9ee-5a4c-7bce-a3d4-Exchange',
					option_text: 'Foreign Exchange',
				},
				{
					id: '018de9ee-5a4c-7bce-a3d4-Forex',
					option_text: 'Forex',
				},
				{
					id: '018de9ee-5a4c-7bce-a3d4-Futures',
					option_text: 'Futures Exchange',
				},
				{
					id: '018de9ee-5a4c-7bce-a3d4-Market',
					option_text: 'Futures Market',
				},
			],
		},
		{
			id: '018de9ee-5a4d-790e-8ea1-2f2adff2b9e3',
			question_text:
				'Which pattern is used to construct objects in software engineering?',
			question_type: 'single_select_mcq',
			points: 1,
			mcq_options: [
				{
					id: '018de9ee-5a4d-790e-8ea1-Builder',
					option_text: 'Builder',
				},
				{
					id: '018de9ee-5a4d-790e-8ea1-Factory',
					option_text: 'Factory',
				},
				{
					id: '018de9ee-5a4d-790e-8ea1-Prototype',
					option_text: 'Prototype',
				},
				{
					id: '018de9ee-5a4d-790e-8ea1-Singleton',
					option_text: 'Singleton',
				},
			],
		},
	],
};
