'use server';
import { DifficultyLevel } from '@/app/(main)/quiz/_components/utils';
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
	user_file_ids: string[];
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
	error?: {
		message: string;
		status: number;
	};
	data?: {
		total: number;
		next_page: string;
		prev_page: string;
		data: QuizGenerateReponse[];
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

	const time_limit = convertTime(json.time_limit);

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
): Promise<{ data?: any; error?: string }> {
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

	const response = await fetch(`${baseUrl}/quiz-attempt/${quizId}/graded`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${sessionId}`,
		},
	});

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

const dummyfeedback = {
	time_start: '2024-02-23T09:22:13.113516',
	total_points: 4,
	time_finish: '2024-02-23T09:27:52.873690',
	time_limit: 'PT300S',
	attempt_score: 2.4,
	attempt_id: '018dd545-b9fc-7f13-ab6d-d6d07716dba4',
	quiz_id: '018dd545-5a90-786d-9991-7f5414eeecdc',
	attempted_questions: [
		{
			question_id: '018dd527-4843-7226-a76e-ef3fe1773a08',
			question_text: 'What is Generative AI?',
			question_type: 'single_select_mcq',
			points: 1,
			points_awarded: 1.0,
			feedback_text:
				'Great job! The selected option correctly defines Generative AI as a type of machine learning that generates new content. Keep up the good work!',
			answer_text: null,
			mcq_options: [
				{
					option_id: '018dd527-4842-74ea-a2a9-0e661bd165a5',
					option_text: 'A type of machine learning that detects anomalies',
					is_correct: false,
					selected_option: false,
				},
				{
					option_id: '018dd527-4842-710a-9d78-91b12b604136',
					option_text: 'A type of machine learning that optimizes algorithms',
					is_correct: false,
					selected_option: false,
				},
				{
					option_id: '018dd527-4841-7e4d-813b-3a20098e3b62',
					option_text: 'A type of machine learning that classifies data',
					is_correct: false,
					selected_option: false,
				},
				{
					option_id: '018dd527-4841-78fe-a0be-d28a38fef33c',
					option_text: 'A type of machine learning that generates new content',
					is_correct: true,
					selected_option: true,
				},
			],
		},
		{
			question_id: '018dd545-68f4-7f09-8ea2-4576e2f49eff',
			question_text: 'Select All Incorrect About Generative AI?',
			question_type: 'multi_select_mcq',
			points: 1,
			points_awarded: 0.0,
			feedback_text:
				"The attempted options are partially correct. The question requires the selection of the incorrect statements about generative AI. The option 'A type of machine learning that classifies data' is the only correct statement, the other selected options are also describing types of machine learning, not generative AI specifically. Please review the characteristics of generative AI to better understand and identify its unique features.",
			answer_text: null,
			mcq_options: [
				{
					option_id: '018dd545-68f4-77c4-9cb3-6528610c6373',
					option_text: 'A type of machine learning that detects anomalies',
					is_correct: true,
					selected_option: true,
				},
				{
					option_id: '018dd545-68f4-7434-afc6-18d947828582',
					option_text: 'A type of machine learning that optimizes algorithms',
					is_correct: true,
					selected_option: true,
				},
				{
					option_id: '018dd545-68f4-7092-9179-d3bda2a0c3b5',
					option_text: 'A type of machine learning that classifies data',
					is_correct: true,
					selected_option: false,
				},
				{
					option_id: '018dd545-68f3-7b79-b7ba-4ae3610aecaf',
					option_text: 'A type of machine learning that generates new content',
					is_correct: false,
					selected_option: false,
				},
			],
		},
		{
			question_id: '018dd545-68f2-7952-9172-3f3707e98a24',
			question_text: 'What is Generative AI?',
			question_type: 'open_text_question',
			points: 1,
			points_awarded: 0.9,
			feedback_text:
				'The attempted answer captures the essence of Generative AI but lacks specificity regarding the type of content it can create, as mentioned in the correct answer.',
			answer_text: 'AI that generates content',
			mcq_options: [],
		},
		{
			question_id: '018dd545-68f3-7164-9740-7a7dfe01329a',
			question_text: 'What is Prompt Engineering for Generative AI?',
			question_type: 'open_text_question',
			points: 1,
			points_awarded: 0.5,
			feedback_text:
				'The attempted answer captures the general idea of prompt engineering for generative AI but lacks the specific details and depth mentioned in the correct answer. It does not fully convey the blend of art and science required, nor does it touch on the need to understand AI capabilities and craft precise queries.',
			answer_text: 'Art of talking with llms to generate content',
			mcq_options: [],
		},
	],
};
