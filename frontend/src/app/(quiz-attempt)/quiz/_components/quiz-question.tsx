'use client';
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

interface QuizQuestionProps {
	question: string;
	options: { label: string; value: string }[];
	correctAnswer: string;
	onSubmit: (answer: string) => void;
}

const question =
	'Q1- Which of the following is a primary characteristic of generative AI?';
const options = [
	{ id: 'opt-1', text: 'Focus on rule-based decision making' },
	{ id: 'opt-2', text: 'Ability to create new, original content' },
	{ id: 'opt-3', text: 'Reliance on large, pre-defined datasets' },
	{ id: 'opt-4', text: 'Emphasis on supervised learning' },
];

export const QuizQuestion = () => {
	const FormSchema = z.object({
		selectedOption: z.enum(
			[options[0].id, options[1].id, options[2].id, options[3].id],
			{
				required_error: 'You need to select an option.',
			}
		),
	});
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		console.log(data);
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
									{question}
								</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className='flex flex-col space-y-1 w-10/12 mx-auto'
									>
										{options.map((option) => (
											<FormItem
												key={option.id}
												className='flex items-center space-x-3 space-y-0 text-gray-950'
											>
												<FormControl>
													<RadioGroupItem value={option.id} />
												</FormControl>
												<FormLabel className='font-normal text-base text-left'>
													{option.text}
												</FormLabel>
											</FormItem>
										))}
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='flex flex-col-reverse gap-y-5 md:gap-y-0 md:flex-row items-center justify-center w-full space-x-4 md:space-x-6 lg:space-x-8 pt-10'>
						<QuizProgress
							currentQuestion={5}
							totalQuestions={10}
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
