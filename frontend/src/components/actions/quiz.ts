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

export async function submitAnswer({
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
