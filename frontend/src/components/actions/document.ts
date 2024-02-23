'use server';
import { getBaseURL } from '@/lib/utils';
import { auth } from '@clerk/nextjs';

export const getDocuments = async () => {
	const { userId, sessionId } = auth();

	if (!userId) {
		return { error: 'User is not logged in' };
	}

	const baseUrl = getBaseURL();

	const url = `${baseUrl}/user-file`;

	console.log('URL', url);
	console.log('sessionId', sessionId);

	const response = await fetch(`${url}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sessionId}`,
		},
		cache: 'no-store',
	});

	if (!response.ok) {
		console.log('GET /user_files failed', response.status, response.statusText);
		return { error: 'Unable to fetch documents' };
	}

	const json = await response.json();
	console.log('GET /user_files success', json);

	return { data: json };
};

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
	const response = await fetch(`${baseUrl}/user-file`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${sessionId}`,
		},

		body: file,
	});

	if (!response.ok) {
		console.log(
			'POST /user-file/:userId failed',
			response.status,
			response.statusText
		);
		return { error: 'Unable to upload file' };
	}

	const json = await response.json();

	console.log('POST /user_file/:userId success', json);

	return { data: json };
}
