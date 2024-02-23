import { attemptQuiz, deleteQuiz } from './quiz';

export const attempt = async (quizId: string) => {
	const res = await attemptQuiz(quizId);

	return res;
};

export const deleteQ = async (quizId: string) => {
	const res = await deleteQuiz(quizId);

	return res;
};
