import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getBaseURL() {
	const base_url = process.env.NEXT_PUBLIC_BASE_URL;

	if (!base_url) {
		throw new Error('Base URL is not defined in the environment variables.');
	}
	return base_url;
}
