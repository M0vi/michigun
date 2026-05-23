import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertBadgeVariants = cva(
  "inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-xs font-semibold text-white shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        error: "bg-red-500/90 border-red-500/20 shadow-red-500/10",
        success: "bg-emerald-500/90 border-emerald-500/20 shadow-emerald-500/10",
        info: "bg-[#111111]/90 border-white/10 shadow-black/50",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
)

interface AlertBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof alertBadgeVariants> {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  action?: {
    label: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

export function AlertBadge({
  className,
  variant,
  icon: Icon,
  label,
  action,
  ...props
}: AlertBadgeProps) {
  return (
    <span className={cn(alertBadgeVariants({ variant }), className)} {...props}>
      <span className="inline-flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 shrink-0 text-white" aria-hidden={true} />}
        <span>{label}</span>
      </span>
      {action && (
        <>
          <span
            className={cn(
              "h-4 w-px",
              variant === "error" && "bg-red-400/50",
              variant === "success" && "bg-emerald-400/50",
              variant === "info" && "bg-white/20",
            )}
          />
          <a href={action.href} className="inline-flex items-center gap-1.5 hover:underline text-white/90 hover:text-white">
            <span>{action.label}</span>
            {action.icon && (
              <action.icon className="w-4 h-4 shrink-0" aria-hidden={true} />
            )}
          </a>
        </>
      )}
    </span>
  )
}
