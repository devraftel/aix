import * as z from 'zod';

export enum DifficultyLevel {
	Easy = 'easy',
	Medium = 'medium',
	Hard = 'hard',
}

export const difficultyLevels = Object.values(DifficultyLevel).map((value) => ({
	value,
	label: value.charAt(0).toUpperCase() + value.slice(1),
}));

export const questionTypes = [
	{
		id: 'single_select_mcq',
		label: 'Single Select MCQs',
	},
	{
		id: 'multi_select_mcq',
		label: 'Multi-Select MCQs',
	},
	{
		id: 'open_text_question',
		label: 'Free Form Questions',
	},
] as const;

export type Documents = {
	value: string;
	label: string;
}[];

export const QuizGenerateValidator = z.object({
	title: z
		.string({
			required_error: 'Please enter a title for the quiz.',
		})
		.min(2, {
			message: 'Quiz Title is too short.',
		}),
	file_ids: z.array(z.string()).nonempty({
		message: 'Please select at least one document to make a quiz from.',
	}),
	time_limit: z
		.string({
			required_error: 'Please enter the time for the quiz.',
		})
		.min(1, {
			message: 'Quiz time must be at least 1 minute.',
		}),
	total_questions_to_generate: z
		.string({
			required_error: 'Please enter the number of questions.',
		})
		.min(1, {
			message: 'Number of questions must be at least 1.',
		}),
	questions_type: z
		.array(z.string())
		.refine((value) => value.some((item) => item), {
			message: 'Please select at least one question type.',
		}),
	difficulty: z.nativeEnum(DifficultyLevel, {
		required_error: 'Please select the difficulty level.',
	}),
	user_prompt: z
		.string({
			required_error: 'Please enter user instructions.',
		})
		.min(10, {
			message: 'User instructions are too short.',
		})
		.max(500, {
			message: 'User instructions are too long.',
		}),
});

export type QuizGenerateRequest = z.infer<typeof QuizGenerateValidator>;
