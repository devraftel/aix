import { attemptQuiz, deleteQuiz, saveAnswer } from './quiz';

export const attempt = async (quizId: string) => {
	const res = await attemptQuiz(quizId);

	return res;
};

export const deleteQ = async (quizId: string) => {
	const res = await deleteQuiz(quizId);

	return res;
};

export const saveQuizAnswer = async ({
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
}) => {
	const res = await saveAnswer({
		attemptId,
		questionId,
		questionType,
		answerText,
		selectedOptions,
	});

	return res;
};
