interface QuizFeedback {
	params: {
		quiz_id: string;
	};
}

const QuizFeedback = ({ params }: QuizFeedback) => {
	const { quiz_id } = params;
	return <div>QuizFeedback {quiz_id}</div>;
};

export default QuizFeedback;
