import { DifficultyLevel } from '@/app/(main)/quiz/_components/utils';

export interface Generate {
	title: string;
	time_limit: string;
	total_questions_to_generate: number;
	questions_type: string[];
	difficulty: DifficultyLevel;
	user_prompt: string;
	user_file_ids: string[];
}

export interface GenerateReponse {
	id: string;
	title: string;
	has_user_attempted: boolean;
	time_limit: string;
	total_points: number;
	total_questions_count: number;
}

export interface Attempt {
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

export interface FinishResponse {
	quiz_id: string;
	time_limit: string;
	time_start: string;
	total_points: number;
	quiz_feedback_id: string | null;
	id: string;
	updated_at: string;
	user_id: string;
	time_finish: string;
	attempt_score: number;
	created_at: string;
}
