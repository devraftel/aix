'use server';
import { getBaseURL } from '@/lib/utils';
import { auth } from '@clerk/nextjs';

export async function createQuiz(data: any) {
	const baseUrl = getBaseURL();
	const response = await fetch(`${baseUrl}/api/quiz`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	const json = await response.json();
	return json;
}

type Response = {
	error?: string;
	data?: any;
};

export async function uploadDocument(file: FormData): Promise<Response> {
	if (!file) {
		return { error: 'Documents are required' };
	}
	console.log('Uploading data', file);
	console.log('\nUploading file', file.get('file'));

	const { userId, sessionId } = auth();
	if (!userId) {
		return { error: 'User is not logged in' };
	}

	const baseUrl = getBaseURL();
	const response = await fetch(`${baseUrl}/user_file`, {
		method: 'POST',
		headers: {
			// 'Content-Type': 'application/json',

			Authorization: `Bearer ${sessionId}`,
		},

		body: file,
	});

	if (!response.ok) {
		console.log(
			'POST /user_file/:userId failed',
			response.status,
			response.statusText
		);
		return { error: 'Unable to upload file' };
	}

	const json = await response.json();

	console.log('POST /user_file/:userId success', json);

	return { data: json };
}
