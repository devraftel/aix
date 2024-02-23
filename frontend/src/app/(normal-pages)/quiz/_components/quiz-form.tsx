'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useFileUploadStore } from '@/components/fileupload-store';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multiselect';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

enum DifficultyLevel {
	Easy = 'easy',
	Medium = 'medium',
	Hard = 'hard',
}

const difficultyLevels = Object.values(DifficultyLevel).map((value) => ({
	value,
	label: value.charAt(0).toUpperCase() + value.slice(1),
}));

const items = [
	{
		id: 'single-select-mcqs',
		label: 'Single Select MCQs',
	},
	{
		id: 'multi-select-mcqs',
		label: 'Multi-Select MCQs',
	},
	{
		id: 'free-form-questions',
		label: 'Free Form Questions',
	},
] as const;

const FormSchema = z.object({
	quizTitle: z
		.string({
			required_error: 'Please enter a title for the quiz.',
		})
		.min(2, {
			message: 'Quiz Title is too short.',
		}),
	documentSelection: z.array(z.string()).nonempty({
		message: 'Please select at least one document to make a quiz from.',
	}),
	quizDuration: z
		.number({
			required_error: 'Please enter the time for the quiz.',
		})
		.min(1, {
			message: 'Quiz time must be at least 1 minute.',
		}),
	questionCount: z
		.number({
			required_error: 'Please enter the number of questions.',
		})
		.min(1, {
			message: 'Number of questions must be at least 1.',
		}),
	questionTypeSelection: z
		.array(z.string())
		.refine((value) => value.some((item) => item), {
			message: 'Please select at least one question type.',
		}),
	difficultyLevelSelection: z.nativeEnum(DifficultyLevel, {
		required_error: 'Please select the difficulty level.',
	}),
	userInstructions: z
		.string({
			required_error: 'Please enter user instructions.',
		})
		.min(10, {
			message: 'User instructions are too short.',
		})
		.max(500, {
			message: 'User instructions are too long.',
		}),
});

export function QuizeForm() {
	const { isDrawerOpen, setIsDrawerOpen } = useFileUploadStore();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			quizTitle: '',
			documentSelection: [],
			quizDuration: undefined,
			questionCount: undefined,
			questionTypeSelection: [],
			difficultyLevelSelection: undefined,
			userInstructions: '',
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema>) {
		toast('Email selected: ', {
			description: data.quizTitle,
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6 text-left max-w-sm w-full'
			>
				<h1 className='font-semibold text-xl md:text-2xl underline underline-offset-8'>
					Generate a Quiz
				</h1>

				<FormField
					control={form.control}
					name='quizTitle'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder='Quiz Title'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='documentSelection'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Documents</FormLabel>
							<MultiSelect
								selected={field.value}
								options={[
									{
										value: 'next.js',
										label: 'Next.js',
									},
									{
										value: 'sveltekit',
										label: 'SvelteKit',
									},
									{
										value: 'nuxt.js',
										label: 'Nuxt.js',
									},
									{
										value: 'remix',
										label: 'Remix',
									},
									{
										value: 'astro',
										label: 'Astro',
									},
									{
										value: 'wordpress',
										label: 'WordPress',
									},
									{
										value: 'express.js',
										label: 'Express.js',
									},
								]}
								{...field}
								className='w-[290px] sm:w-[384px]'
							/>
							<FormDescription>
								Can&apos;t find the document you are looking for?{' '}
								<Button
									className='font-semibold text-gray-500 hover:underline p-0 h-fit'
									variant={'link'}
									type='button'
									onClick={() => setIsDrawerOpen(!isDrawerOpen)}
								>
									Upload a new document
								</Button>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='quizDuration'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Quiz Duration (in minutes)</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Enter the time for the quiz.'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='questionTypeSelection'
					render={() => (
						<FormItem>
							<div className='mb-4'>
								<FormLabel className='text-base'>Question Types</FormLabel>
								<FormDescription>
									Select the type of questions you want to include in the quiz.
								</FormDescription>
							</div>
							{items.map((item) => (
								<FormField
									key={item.id}
									control={form.control}
									name='questionTypeSelection'
									render={({ field }) => {
										return (
											<FormItem
												key={item.id}
												className='flex flex-row items-start space-x-3 space-y-0'
											>
												<FormControl>
													<Checkbox
														checked={field.value?.includes(item.id)}
														onCheckedChange={(checked) => {
															return checked
																? field.onChange([...field.value, item.id])
																: field.onChange(
																		field.value?.filter(
																			(value) => value !== item.id
																		)
																  );
														}}
													/>
												</FormControl>
												<FormLabel className='font-normal'>
													{item.label}
												</FormLabel>
											</FormItem>
										);
									}}
								/>
							))}
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='questionCount'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Number of Questions</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Enter the number of questions.'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='difficultyLevelSelection'
					render={({ field }) => (
						<FormItem className='space-y-3'>
							<FormLabel>
								Select the difficulty level for the questions
							</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className='flex flex-col space-y-1'
								>
									{difficultyLevels.map((level) => (
										<FormItem
											key={level.value}
											className='flex items-center space-x-3 space-y-0'
										>
											<FormControl>
												<RadioGroupItem value={level.value} />
											</FormControl>
											<FormLabel className='font-normal'>
												{level.label}
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='userInstructions'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Quiz Instructions</FormLabel>
							<FormControl>
								<Textarea
									placeholder='Enter instructions to generate the quiz.'
									className='resize-none'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Enter the instructions for the quiz. You can use markdown
								formatting.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					className='w-full'
					type='submit'
				>
					Generate Quiz
				</Button>
			</form>
		</Form>
	);
}
