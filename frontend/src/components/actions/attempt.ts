import { attemptQuiz } from './quiz';

export const attempt = async (quizId: string) => {
	const res = await attemptQuiz(quizId);

	return res;
};
