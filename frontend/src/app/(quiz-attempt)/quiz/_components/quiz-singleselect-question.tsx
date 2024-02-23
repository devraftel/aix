'use client';
import { submitA } from '@/components/actions/attempt';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { QuizProgress } from './quiz-progress';

interface Props {
	question_text: string;
	question_type:
		| 'single_select_mcq'
		| 'multi_select_mcq'
		| 'open_text_question';
	mcq_options: {
		id: string;
		option_text: string;
	}[];
	total_questions: number;
	current_question: number;
	handleSubmit: () => void;
	attempt_id: string;
	question_id: string;
}

export const QuizSingleSelectQuestion = ({
	mcq_options,
	question_text,
	question_type,
	current_question,
	total_questions,
	handleSubmit,
	attempt_id,
	question_id,
}: Props) => {
	const FormSchema = z.object({
		selectedOption: z.enum(
			[
				mcq_options[0].id,
				mcq_options[1].id,
				mcq_options[2].id,
				mcq_options[3].id,
			],

			{
				required_error: 'You need to select an option.',
			}
		),
	});
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		// handleSubmit();
		// console.log(data);
		try {
			const res = await submitA({
				attemptId: attempt_id,
				questionType: question_type,
				selectedOptions: [data.selectedOption],
				questionId: question_id,
			});

			if (res.error) {
				console.error('Error submitting answer:', res.error);
				return;
			}

			console.log('Answer submitted:', res.data);
			form.reset();
			handleSubmit();
		} catch (error) {
			console.error('Error submitting answer:', error);
		}
	}

	return (
		<div className='flex flex-col w-full'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-6'
				>
					<FormField
						control={form.control}
						name='selectedOption'
						render={({ field }) => (
							<FormItem className='space-y-3 flex flex-col'>
								<FormLabel className='text-lg font-semibold mb-4 text-left w-11/12 mx-auto'>
									{question_text}
								</FormLabel>
								{question_type !== 'open_text_question' && (
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-col space-y-1 w-10/12 mx-auto'
										>
											{mcq_options.map((option) => (
												<FormItem
													key={option.id}
													className='flex items-center space-x-3 space-y-0 text-gray-950'
												>
													<FormControl>
														<RadioGroupItem value={option.id} />
													</FormControl>
													<FormLabel className='font-normal text-base text-left'>
														{option.option_text}
													</FormLabel>
												</FormItem>
											))}
										</RadioGroup>
									</FormControl>
								)}
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex flex-col-reverse gap-y-5 md:gap-y-0 md:flex-row items-center justify-center w-full space-x-4 md:space-x-6 lg:space-x-8 pt-10'>
						<QuizProgress
							currentQuestion={current_question}
							totalQuestions={total_questions}
						/>
						<Button
							className='px-6 md:px-8 lg:px-10 h-9'
							size='default'
							type='submit'
							disabled={!form.formState.isValid}
						>
							Continue
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};
