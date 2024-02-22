'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
	<div className=' p-0.5 rounded-full border border-gray-950 bg-gray-100  dark:bg-gray-800 w-[80%]'>
		<ProgressPrimitive.Root
			ref={ref}
			className={cn(
				'relative h-2 w-full overflow-hidden rounded-full bg-gray-100  dark:bg-gray-800',
				className
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				className='h-full w-full flex-1 bg-gray-900 transition-all dark:bg-gray-50 rounded-full'
				style={{
					transform: `translateX(-${100 - (value || 0)}%)`,
				}}
			/>
		</ProgressPrimitive.Root>
	</div>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
