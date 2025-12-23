import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CCFF00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-[#CCFF00] text-[#0B0B0B] hover:bg-[#CCFF00]/90 hover:shadow-[0_0_20px_rgba(204,255,0,0.5)]",
                destructive:
                    "bg-red-500 text-white hover:bg-red-500/90",
                outline:
                    "border border-zinc-800 bg-transparent text-white hover:bg-zinc-900 hover:border-[#CCFF00]/50",
                secondary:
                    "bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800",
                ghost:
                    "text-gray-400 hover:text-white hover:bg-zinc-900",
                link:
                    "text-[#CCFF00] underline-offset-4 hover:underline",
                glass:
                    "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20",
            },
            size: {
                default: "h-10 px-6 py-2",
                sm: "h-8 px-4 text-xs",
                lg: "h-12 px-8 text-base",
                xl: "h-14 px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
