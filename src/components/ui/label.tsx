import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-xs font-semibold text-neutral-850 leading-none select-none", className)}
        {...props}
      />
    )
  }
)
Label.displayName = "Label"

export { Label }
