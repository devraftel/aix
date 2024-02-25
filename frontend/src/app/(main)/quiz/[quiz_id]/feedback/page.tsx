import { quizFeedback } from '@/components/actions/quiz';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { QuestionButton } from './question-button';
import { SourceCard } from './source-card';

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
				<div className='w-full flex items-start justify-between py-2 md:py-4'>
					<div>
						<h1 className='font-semibold text-2xl text-left mb-1 font-roboto'>
							Quiz Feedback:
						</h1>
						<p className='text-gray-800 text-base font-semibold'>
							Feedback for the quiz: <span>{feedback?.quiz_id}</span>
						</p>
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
									question_id={question.question_id}
								/>
							))}
						</div>
					</div>

					{/* Questions Feedback */}
					<div className='w-full md:w-9/12 space-y-4'>
						<div className=''>
							{feedback.attempted_questions.map((question, index) => {
								return (
									<div
										key={question.question_id}
										id={question.question_id}
										className='flex flex-col space-y-4'
									>
										<div className='flex flex-col space-y-2'>
											<h3 className='text-lg font-semibold text-left'>
												Q {index + 1}: {question.question_text}
											</h3>
											<div className=''>
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
													<OpenText answer={question?.answer_text} />
												)}
											</div>
										</div>

										<div className='flex flex-col gap-y-2 bg-gray-200/70 p-2 md:p-4 lg:p-8 rounded-r-sm rounded-l-sm border-l-4 border-gray-900'>
											<div className='flex items-center justify-normal space-x-2'>
												<h2 className='font-roboto text-xl font-semibold'>
													Feedback
												</h2>
												<Badge
													className='space-x-1.5'
													variant={'secondary'}
												>
													<span className='font-semibold'>Points:</span>
													<span>
														{question.points_awarded}/{question.points}
													</span>
												</Badge>
											</div>
											<p className='mb-4'>
												{
													question.feedback_text /* This is the feedback for the question */
												}
											</p>
											<div className='flex flex-col space-y-2 md:space-y-4'>
												<h2 className='font-roboto text-xl font-semibold'>
													Learning Sources
												</h2>
												<div className='flex gap-4 flex-wrap'>
													<SourceCard
														title={'Learning Python with freeCodeCamp'}
														link='https://www.freecodecamp.org/learn/scientific-computing-with-python/python-for-everybody/'
													/>
												</div>
											</div>
										</div>

										<div>
											{index < feedback.attempted_questions.length - 1 && (
												<Separator className='mb-4 md:mb-6 mt-2 md:mt-4 text-gray-950 bg-gray-700' />
											)}
										</div>
									</div>
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

type MultiSelectProps = {
	options: Option[];
	correct_values: string[];
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
						className={cn(
							`flex items-center space-x-3 font-semibold space-y-0 text-gray-950 `
							// option.id === correct_value ? 'text-green-950' : 'text-red-950'
						)}
					>
						<RadioGroupItem
							value={option.id}
							disabled
						/>
						<div className='font-normal text-base text-left'>
							{option.label}
						</div>
					</div>
				))}
			</RadioGroup>
		);
	}
};

const MultiSelect = ({ options, correct_values }: MultiSelectProps) => {
	return (
		<div className='flex flex-col space-y-1 w-11/12 mx-auto'>
			{options.map((item) => (
				<div
					key={item.id}
					className={cn(
						`flex items-center space-x-3 font-semibold space-y-0 text-gray-950 `
						// correct_values.includes(item.id) ? 'text-green-950' : 'text-red-950'
					)}
				>
					<Checkbox
						checked={correct_values.includes(item.id)}
						disabled
					/>
					<div className='font-normal text-base text-left'>{item.label}</div>
				</div>
			))}
		</div>
	);
};

const OpenText = ({ answer }: { answer: string | null }) => {
	return (
		<div className='w-11/12 mx-auto'>
			<p className='text-base font-normal text-left'>{answer}</p>
		</div>
	);
};
