'use client';
import { useFileUploadStore } from '@/components/fileupload-store';
import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const MAX_SIZE_MB = 35;

const formSchema = z.object({
	pdf: z.array(
		z.object({
			file: z
				.custom<File>()
				.refine((file) => file.size < MAX_SIZE_MB * 1024 * 1024, {
					message: `File size should be less than ${MAX_SIZE_MB}MB.`,
				})
				.refine((file) => file.type?.startsWith('application/pdf'), {
					message: 'Only PDFs are allowed.',
				}),
		})
	),
});

export const FileUpload = () => {
	const [uploadProgress, setUploadProgress] = useState(0);
	const [isUploading, setIsUploading] = useState(false);

	const { openDrawer, closeDrawer, isDrawerOpen } = useFileUploadStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			pdf: [],
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setIsUploading(true);
		setUploadProgress(0);

		values.pdf.forEach((file, index) => {
			setTimeout(() => {
				setUploadProgress(
					(prevProgress) => prevProgress + 100 / values.pdf.length
				);

				toast(`File Uploaded successfully.`, {
					description: `Your file ${file.file.name} has been uploaded successfully.`,
					closeButton: true,
				});

				if (index === values.pdf.length - 1) {
					setIsUploading(false);
					closeDrawer();
				}
			}, index * 500);
		});

		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-8 w-full max-w-md'
			>
				<FormField
					control={form.control}
					name='pdf'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className='p-4 pb-0 border-2 border-gray-400 border-dashed rounded-xl h-[160px]'>
									<label
										htmlFor='fileUpload'
										className='cursor-pointer'
									>
										<div className='flex flex-col items-center justify-center h-full'>
											<Upload />
											<h3 className='mt-3 font-semibold text-gray-900'>
												Drag and drop or{' '}
												<span className='text-amber-500'>choose</span> file to
												upload
											</h3>
											<p className='text-sm text-gray-500 dark:text-gray-400'>
												Select pdf file
											</p>
										</div>
										<Input
											id='fileUpload'
											type='file'
											accept='.pdf'
											className='hidden'
											multiple={true}
											onChange={(e) => {
												const files = Array.from(e.target.files || []).map(
													(file) => ({ file })
												);
												field.onChange(files);
											}}
										/>
									</label>
								</div>
							</FormControl>
							<FormDescription>
								Upload the files you want to create a quiz from.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					className='w-full'
					type='submit'
					disabled={isUploading || form.formState.isSubmitting}
					isLoading={isUploading || form.formState.isSubmitting}
				>
					Upload Files
				</Button>
			</form>
			{isUploading && <div>Uploading: {uploadProgress}%</div>}
		</Form>
	);
};

export function DrawerDemo() {
	const { isDrawerOpen } = useFileUploadStore();
	return (
		<Drawer open={isDrawerOpen}>
			<DrawerContent className='flex flex-col items-center'>
				<DrawerHeader>
					<DrawerTitle>Add new files</DrawerTitle>
				</DrawerHeader>
				<FileUpload />
			</DrawerContent>
		</Drawer>
	);
}
