import { getBaseURL } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import { NextRequest } from 'next/server';

interface DeleteProps {
	params: {
		file_id: string;
	};
}

export async function DELETE(request: NextRequest, { params }: DeleteProps) {
	const { file_id } = params;

	if (!file_id) {
		return new Response('File ID is required', { status: 400 });
	}

	const { sessionId } = auth();

	if (!sessionId) {
		return new Response('Unauthorized', { status: 401 });
	}

	const baseUrl = getBaseURL();

	const url = `${baseUrl}/user-file/${file_id}`;

	const response = await fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${sessionId}`,
		},
		cache: 'no-store',
	});

	if (response.status === 404) {
		console.log(
			'DELETE /user_files failed',
			response.status,
			response.statusText
		);
		return new Response('File not found', { status: 404 });
	}

	if (!response.ok) {
		console.log(
			'DELETE /user_files failed',
			response.status,
			response.statusText
		);
		return new Response('Failed to delete the file', { status: 500 });
	}

	console.log(
		'DELETE /user_files success',
		response.status,
		response.statusText
	);

	return new Response('File deleted successfully', { status: 200 });
}
