import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none font-sans",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#3667F0] text-white hover:bg-[#3667F0]/90",
        secondary:
          "border-[#D1D5DB] bg-[#F3F4F6] text-[#0F223D] hover:bg-[#E5E7EB]",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-[#374151] border-[#D1D5DB] dark:text-slate-200 dark:border-slate-700",
        ats: "border-[#25C78A]/40 bg-[#25C78A]/10 text-[#1e9d6d] dark:border-[#25C78A]/50 dark:bg-[#25C78A]/20 dark:text-[#25C78A]",
        premium: "border-[#7C5CFC]/40 bg-[#7C5CFC]/10 text-[#7C5CFC] dark:border-[#7C5CFC]/50 dark:bg-[#7C5CFC]/20 dark:text-[#967BFF]",
        campus: "border-[#32D3E1]/40 bg-[#32D3E1]/10 text-[#008ba3] dark:border-[#32D3E1]/50 dark:bg-[#32D3E1]/20 dark:text-[#32D3E1]",
        recruiter: "border-[#3667F0]/40 bg-[#3667F0]/10 text-[#3667F0] dark:border-[#3667F0]/50 dark:bg-[#3667F0]/20 dark:text-[#5D82FF]",
        primary: "border-[#3667F0]/40 bg-[#3667F0]/10 text-[#3667F0] dark:border-[#3667F0]/50 dark:bg-[#3667F0]/20 dark:text-[#5D82FF]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
