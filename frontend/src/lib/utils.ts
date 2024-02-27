import { clsx, type ClassValue } from 'clsx';
import moment from 'moment';
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

export function convertMinutesTimeDelta(minutes: string): string {
	return `PT${minutes}M`;
}

export function formatSeconds(seconds: string): string {
	const _seconds = parseInt(seconds, 10);

	const duration = moment.duration(_seconds, 'seconds');

	const hours = duration.hours();
	const minutes = duration.minutes();
	const secs = duration.seconds();

	let formattedTime = '';
	if (hours > 0) {
		formattedTime += `${hours}h `;
	}
	if (minutes > 0 || hours > 0) {
		formattedTime += `${minutes}m : `;
	}
	formattedTime += `${secs}s `;

	return formattedTime.trim();
}

export function convertISODurationToSeconds(isoDuration: string) {
	const duration = moment.duration(isoDuration);
	return duration.asSeconds();
}
