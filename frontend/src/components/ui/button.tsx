import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aix-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-aix-950 dark:focus-visible:ring-aix-300',
	{
		variants: {
			variant: {
				default:
					'bg-aix-900 text-aix-50 hover:bg-aix-900/90 dark:bg-aix-50 dark:text-aix-900 dark:hover:bg-aix-50/90',
				destructive:
					'bg-red-500 text-aix-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-aix-50 dark:hover:bg-red-900/90',
				outline:
					'border border-aix-200 bg-white hover:bg-aix-100 hover:text-aix-900 dark:border-aix-800 dark:bg-aix-950 dark:hover:bg-aix-800 dark:hover:text-aix-50',
				secondary:
					'bg-aix-100 text-aix-900 hover:bg-aix-100/80 dark:bg-aix-800 dark:text-aix-50 dark:hover:bg-aix-800/80',
				ghost:
					'hover:bg-aix-100 hover:text-aix-900 dark:hover:bg-aix-800 dark:hover:text-aix-50',
				link: 'text-aix-900 underline-offset-4 hover:underline dark:text-aix-50',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			isLoading,
			children,
			size,
			asChild = false,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				disabled={isLoading}
				ref={ref}
				{...props}
			>
				{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin ' />}
				{children}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
