import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useFileDeleteStore } from '@/store/filedeletestore';
import { useFileUploadStore } from '@/store/fileupload-store';
import { ChevronsUpDown, Trash2, Upload, X } from 'lucide-react';

export type OptionType = {
	label: string;
	value: string;
};

interface MultiSelectProps {
	options: OptionType[];
	selected: string[];
	onChange: React.Dispatch<React.SetStateAction<string[]>>;
	className?: string;
}

function MultiSelect({
	options,
	selected,
	onChange,
	className,
	...props
}: MultiSelectProps) {
	const [open, setOpen] = React.useState(false);
	const { isDrawerOpen, setIsDrawerOpen } = useFileUploadStore();

	const { isFileDeleteOpen, setIsFileDeleteOpen, setFileId } =
		useFileDeleteStore();

	const handleUnselect = (item: string) => {
		onChange(selected.filter((i) => i !== item));
	};

	const handleFileUpload = () => {
		setIsDrawerOpen(true);
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
			{...props}
		>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className={`w-full justify-between ${
						selected.length > 1 ? 'h-full' : 'h-10'
					}`}
					onClick={() => setOpen(!open)}
				>
					<div className='flex gap-1 flex-wrap'>
						{selected.map((item) => {
							const label =
								options.find((option) => option.value === item)?.label || item;

							return (
								<Badge
									variant='secondary'
									key={item}
									className='mr-1 mb-1'
									onClick={() => handleUnselect(item)}
								>
									{label}
									<button
										className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handleUnselect(item);
											}
										}}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onClick={() => handleUnselect(item)}
									>
										<X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
									</button>
								</Badge>
							);
						})}
					</div>
					<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command className={className}>
					<CommandInput placeholder='Search ...' />
					<CommandEmpty>No item found.</CommandEmpty>
					<CommandGroup className='max-h-64 overflow-auto'>
						{options.map((option) => (
							<CommandItem
								key={option.value}
								onSelect={() => {
									onChange(
										selected.includes(option.value)
											? selected.filter((item) => item !== option.value)
											: [...selected, option.value]
									);
									setOpen(true);
								}}
								className='flex items-center justify-between'
							>
								{option.label}
								<Button
									className='h-6 w-6 bg-white border text-red-500 hover:text-white'
									size={'icon'}
									variant={'destructive'}
									onClick={(e) => {
										e.stopPropagation(); // Prevent the onSelect event from firing
										setFileId(option.value);
										setIsFileDeleteOpen(!isFileDeleteOpen);
									}}
								>
									<Trash2 className='size-4 ' />
								</Button>
							</CommandItem>
						))}
						<CommandItem
							onSelect={handleFileUpload}
							className='flex items-center justify-center font-roboto py-4 cursor-pointer'
						>
							<Upload className='size-4 mr-2' />
							Upload Document
						</CommandItem>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export { MultiSelect };
