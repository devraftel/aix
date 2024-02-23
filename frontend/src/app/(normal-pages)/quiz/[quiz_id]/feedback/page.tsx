import { quizFeedback } from '@/components/actions/quiz';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { QuestionButton } from './question-button';

interface QuizFeedback {
	params: {
		quiz_id: string;
	};
}

export interface Feedback {
	time_start: Date;
	total_points: number;
	time_finish: Date;
	time_limit: string;
	attempt_score: number;
	attempt_id: string;
	quiz_id: string;
	attempted_questions: AttemptedQuestion[];
}

export interface AttemptedQuestion {
	question_id: string;
	question_text: string;
	question_type: string;
	points: number;
	points_awarded: number;
	feedback_text: string;
	answer_text: null | string;
	mcq_options: McqOption[];
}

export interface McqOption {
	option_id: string;
	option_text: string;
	is_correct: boolean;
	selected_option: boolean;
}

const QuizFeedback = async ({ params }: QuizFeedback) => {
	const { quiz_id } = params;

	const { data, error } = await quizFeedback(quiz_id);

	if (!data) {
		return <div>Feedback not found : {error}</div>;
	}

	const feedback: Feedback = data;

	return (
		<div className='w-full h-full'>
			<MaxWidthWrapper className='mb-12 mt-20 sm:mt-32 flex flex-col items-center justify-center w-full h-full'>
				<div className='w-full flex items-start justify-between'>
					<div>
						<h1 className='font-semibold text-2xl text-left mb-1 font-roboto'>
							Quiz Feedback:
						</h1>
						<p className='text-gray-800 text-base font-semibold'>
							Feedback for the quiz: <span>{feedback?.quiz_id}</span>
						</p>
						<hr className='mb-6 w-[20%] bg-gray-900 text-gray-900' />
					</div>
					<div>
						<Badge>
							<p>
								Score:{' '}
								<span>
									{feedback?.attempt_score}/{feedback?.total_points}
								</span>
							</p>
						</Badge>
					</div>
				</div>
				<div className='w-full h-full flex flex-col items-center md:items-start justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 border-t-2 pt-4'>
					{/* Questions List */}
					<div className='w-full md:w-3/12'>
						<h2 className='font-roboto text-xl font-semibold mb-4'>
							Questions List
						</h2>
						<div className='flex items-start gap-4 flex-wrap'>
							{feedback.attempted_questions.map((question, index) => (
								<QuestionButton
									key={index}
									question={(index + 1).toString()}
								/>
							))}
						</div>
					</div>

					{/* Questions Feedback */}
					<div className='w-full md:w-9/12 space-y-4'>
						<div className=''>
							{feedback.attempted_questions.map((question, index) => {
								return (
									<>
										<h3 className='text-lg font-semibold text-left'>
											Q {index + 1}: {question.question_text}
										</h3>
										<div className='py-4'>
											{question.question_type === 'single_select_mcq' ? (
												<SingleSelect
													options={question.mcq_options.map((option) => {
														return {
															id: option.option_id,
															label: option.option_text,
														};
													})}
													correct_value={
														question.mcq_options.find(
															(option) => option.is_correct
														)?.option_id || ''
													}
												/>
											) : question.question_type === 'multi_select_mcq' ? (
												<MultiSelect
													options={question.mcq_options.map((option) => {
														return {
															id: option.option_id,
															label: option.option_text,
														};
													})}
													correct_values={question.mcq_options
														.filter((option) => option.is_correct)
														.map((option) => option.option_id)}
												/>
											) : (
												<OpenText answer={question.feedback_text} />
											)}
										</div>
										<h2 className='font-roboto text-xl font-semibold mb-3'>
											Feedback
										</h2>
										<p className='mb-8'>
											<span className='font-semibold'>Points:</span>{' '}
											{question.points_awarded}/{question.points}
											{
												question.feedback_text /* This is the feedback for the question */
											}
										</p>
									</>
								);
							})}
						</div>
					</div>
				</div>
			</MaxWidthWrapper>
		</div>
	);
};

export default QuizFeedback;

type Option = {
	id: string;
	label: string;
};

type SingleSelectProps = {
	options: Option[];
	correct_value: string;
};

const SingleSelect = ({ options, correct_value }: SingleSelectProps) => {
	{
		return (
			<RadioGroup
				defaultValue={correct_value}
				className='flex flex-col space-y-1 w-11/12 mx-auto'
			>
				{options.map((option) => (
					<div
						key={option.id}
						// className='flex items-center space-x-3 space-y-0 text-gray-950'
						className={`flex items-center space-x-3 font-semibold space-y-0 text-gray-950 ${
							option.id === correct_value ? 'text-green-950' : 'text-red-950'
						}`}
					>
						<div>
							<RadioGroupItem
								value={option.id}
								disabled
							/>
						</div>
						<div className='font-normal text-base text-left'>
							{option.label}
						</div>
					</div>
				))}
			</RadioGroup>
		);
	}
};

type MultiSelectProps = {
	options: Option[];
	correct_values: string[];
};

const MultiSelect = ({ options, correct_values }: MultiSelectProps) => {
	return (
		<div className='flex flex-col space-y-1 w-11/12 mx-auto'>
			{options.map((item) => (
				<div
					key={item.id}
					className={`flex items-center space-x-3 font-semibold space-y-0 text-gray-950 ${
						correct_values.includes(item.id) ? 'text-green-950' : 'text-red-950'
					}`}
				>
					<div>
						<Checkbox
							checked={correct_values.includes(item.id)}
							disabled
						/>
					</div>
					<div className='font-normal text-base text-left'>{item.label}</div>
				</div>
			))}
		</div>
	);
};

const OpenText = ({ answer }: { answer: string }) => {
	return (
		<div className='w-11/12 mx-auto'>
			<p className='text-base font-normal text-left'>{answer}</p>
		</div>
	);
};
