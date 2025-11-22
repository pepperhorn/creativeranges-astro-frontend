import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border',
  {
    variants: {
      variant: {
        default: 'bg-gray text-gray-dark border-gray-300 hover:bg-gray/90 hover:text-accent hover:border-accent',
        destructive: 'bg-red-600 text-white border-red-600 hover:bg-red-500 hover:border-red-500',
        outline: 'border-gray-500 bg-transparent hover:text-accent hover:border-accent',
        secondary: 'bg-blue text-white border-blue hover:bg-blue-800 dark:bg-accent dark:border-accent',
        ghost: 'bg-transparent text-gray-900 border-transparent hover:bg-background-muted dark:text-white',
        link: 'text-gray-700 underline-offset-4 hover:text-accent dark:text-gray-500 border-transparent',
      },
      size: {
        default: 'h-12 px-5 py-2.5',
        sm: 'h-10 rounded-md px-4',
        lg: 'h-12 rounded-md px-9',
        icon: 'size-11 p-0',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  block?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, block = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return <Comp className={cn(buttonVariants({ variant, size, className, block }))} ref={ref} {...props} />;
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
