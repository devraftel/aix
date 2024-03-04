'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { FileText, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { QUERY_KEY } from '@/lib/constants';
import { useFileUploadStore } from '@/store/fileupload-store';

import { uploadDocument } from '@/components/actions/document';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const MAX_SIZE_MB = parseInt(process.env.MAX_SIZE_MB ?? '2');

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

export const FileUploadForm = () => {
	const [isUploading, setIsUploading] = useState(false);
	const queryClient = useQueryClient();

	const { isDrawerOpen, setIsDrawerOpen } = useFileUploadStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			pdf: [],
		},
	});

	return (
		<Form {...form}>
			<form className='space-y-8 w-full flex items-center justify-center'>
				<FormField
					control={form.control}
					name='pdf'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className='flex flex-col sm:flex-row items-center sm:justify-between w-full space-x-0 sm:space-x-2'>
									<div className='p-4 pb-0 border-2 border-gray-400 border-dashed rounded-xl h-[160px] max-w-md'>
										<label
											htmlFor='fileUpload'
											className='cursor-pointer'
										>
											<div className='flex flex-col items-center justify-center h-full'>
												<Upload />
												<h3 className='mt-3 font-semibold text-gray-900'>
													Select{' '}
													<span className='text-amber-500'>PDF files</span> for
													upload
												</h3>
												<p className='text-sm text-gray-500 dark:text-gray-400'>
													You may select multiple files at once. Click to
													browse.
												</p>
											</div>
											<Input
												id='fileUpload'
												type='file'
												accept='.pdf'
												className='hidden'
												multiple={true}
												onChange={async (e) => {
													const files = Array.from(e.target.files || []).map(
														(file) => ({ file })
													);
													field.onChange(files);

													// ---
													const isValid = await form.trigger('pdf');

													if (!isValid) {
														// If validation fails, stop the upload process
														toast(
															`File size should be less than ${MAX_SIZE_MB}MB.`,
															{
																description: `Your file ${files[0].file.name} is too large.`,
																closeButton: true,
															}
														);
														return;
													}

													setIsUploading(true);

													files.forEach(async (file, index) => {
														try {
															const formData = new FormData();
															formData.append('file', file.file);

															const res = await uploadDocument(formData);

															if (res.error) {
																toast(`File upload failed.`, {
																	description: `Your file ${file.file.name} failed to upload.`,
																	closeButton: true,
																});
																setIsUploading(false);
																return;
															}

															toast(`File Uploaded successfully.`, {
																description: `Your file ${file.file.name} has been uploaded successfully.`,
																closeButton: true,
															});

															if (index === files.length - 1) {
																setIsUploading(false);
																queryClient.invalidateQueries({
																	queryKey: [QUERY_KEY.DOCUMENTS],
																});
																setIsDrawerOpen(!isDrawerOpen);
															}
														} catch (error) {
															console.log(error);
															toast(`File upload failed.`, {
																description: `Your file ${file.file.name} could not be uploaded.`,
																closeButton: true,
															});
														} finally {
															setIsUploading(false);
														}
													});
												}}
											/>
										</label>
									</div>
									{form.watch('pdf') && (
										<div className='mt-4 sm:mt-0 md:col-span-1'>
											{form.watch('pdf').map((file, index) => (
												<div
													key={index}
													className='flex items-center space-x-2'
												>
													<Alert>
														<FileText className='h-4 w-4' />

														<AlertTitle className='truncate block overflow-hidden text-overflow-ellipsis whitespace-nowrap'>
															{file.file.name}
														</AlertTitle>
														<AlertDescription>
															{(file.file.size / (1024 * 1024)).toFixed(2)} MB
														</AlertDescription>
													</Alert>
												</div>
											))}
										</div>
									)}
								</div>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};

export function DrawerFileUpload() {
	const { isDrawerOpen, setIsDrawerOpen } = useFileUploadStore();
	return (
		<Drawer
			open={isDrawerOpen}
			onOpenChange={setIsDrawerOpen}
			onClose={() => {
				setIsDrawerOpen(false);
			}}
		>
			<DrawerContent className='flex flex-col items-center pb-5 md:pb-10'>
				<DrawerHeader>
					<DrawerTitle>Add new files</DrawerTitle>
				</DrawerHeader>
				<FileUploadForm />
			</DrawerContent>
		</Drawer>
	);
}
