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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
	isLastQuestion: boolean;
}

export const QuizOpentextQuestion = ({
	question_text,
	question_type,
	current_question,
	total_questions,
	handleSubmit,
	attempt_id,
	question_id,
	isLastQuestion,
}: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const FormSchema = z.object({
		freeformAnswer: z.string({
			required_error: 'You need to provide an answer.',
		}),
	});
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			setIsLoading(true);
			const res = await submitA({
				attemptId: attempt_id,
				questionType: question_type,
				answerText: data.freeformAnswer,
				questionId: question_id,
			});

			if (res.error) {
				console.error('Error submitting answer:', res.error);
				return;
			}

			console.log('Answer submitted:', res.data);
			form.resetField('freeformAnswer');
			form.reset();
			handleSubmit();
		} catch (error) {
			console.error('Error submitting answer:', error);
		} finally {
			setIsLoading(false);
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
						name='freeformAnswer'
						render={({ field }) => (
							<FormItem className='space-y-3 flex flex-col'>
								<FormLabel className='text-lg font-semibold mb-4 text-left w-11/12 mx-auto'>
									{question_text}
								</FormLabel>
								{question_type === 'open_text_question' && (
									<FormControl>
										<Textarea
											placeholder='Type your answer here...'
											className='h-40 w-11/12 mx-auto'
											{...field}
										/>
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
							disabled={!form.formState.isValid || isLoading}
							isLoading={isLoading || form.formState.isSubmitting}
						>
							{isLastQuestion ? 'Submit Quiz' : 'Next Question'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};