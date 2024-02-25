'use server';
import { getBaseURL } from '@/lib/utils';
import { auth } from '@clerk/nextjs';

export interface UserFileResponse {
	total: number;
	next_page: string;
	prev_page: string;
	data: {
		id: string;
		file_name: string;
	}[];
}

export const getDocuments = async (): Promise<UserFileResponse> => {
	const { userId, sessionId } = auth();

	if (!userId) {
		throw new Error('User is not logged in');
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

	if (response.status == 404) {
		console.log('GET /user_files failed', response.status, response.statusText);
		return { total: 0, next_page: '', prev_page: '', data: [] };
	} else if (!response.ok) {
		console.log('GET /user_files failed', response.status, response.statusText);
		// return { error: 'Unable to fetch documents' };
		throw new Error('Unable to fetch documents');
	}

	const json = await response.json();
	console.log('GET /user_files success', json);

	return json;
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
