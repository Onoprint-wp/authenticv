import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[12px] border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-brand-blue focus-visible:ring-3 focus-visible:ring-brand-blue/20 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 font-sans",
  {
    variants: {
      variant: {
        default: "bg-[#3667F0] text-white hover:bg-[#3667F0]/90 active:bg-[#3667F0] dark:bg-[#3667F0] dark:hover:bg-[#3667F0]/90",
        secondary:
          "border-[#D1D5DB] bg-white text-[#0F223D] hover:bg-[#F3F4F6] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        outline:
          "border-[#3667F0] bg-transparent text-[#3667F0] hover:bg-[#3667F0]/10 dark:border-[#3667F0] dark:text-[#3667F0]",
        ghost:
          "bg-transparent text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
        link: "text-[#3667F0] underline-offset-4 hover:underline",
        ai: "gradient-ai text-white hover:opacity-95 shadow-sm border-transparent focus-visible:ring-ai-violet/50",
      },
      size: {
        default:
          "h-11 min-h-[44px] gap-2 px-5 text-sm",
        xs: "h-7 min-h-[28px] gap-1 rounded-[8px] px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 min-h-[36px] gap-1.5 rounded-[10px] px-3.5 text-xs",
        lg: "h-12 min-h-[48px] gap-2.5 rounded-[12px] px-6 text-base",
        icon: "size-11 rounded-[12px]",
        "icon-xs": "size-7 rounded-[8px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-[10px]",
        "icon-lg": "size-12 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
