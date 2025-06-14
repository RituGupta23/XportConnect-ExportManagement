import { useToast } from "./use-toast"
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport, ToastIcon } from "./toast"
import { cn } from "../../lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant = "default", ...props }) => (
        <Toast key={id} variant={variant} {...props}>
          <div className="grid gap-1">
            <div className="flex items-center gap-3">
              {variant !== "default" && <ToastIcon variant={variant} />}
              <div className="flex-1">
                {title && (
                  <ToastTitle className={cn(
                    variant === "success" && "text-cyan-700",
                    variant === "error" && "text-indigo-700",
                    variant === "warning" && "text-sky-700",
                    variant === "info" && "text-violet-700",
                    variant === "default" && "text-blue-700",
                  )}>
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className={cn(
                    variant === "success" && "text-cyan-600/90",
                    variant === "error" && "text-indigo-600/90",
                    variant === "warning" && "text-sky-600/90",
                    variant === "info" && "text-violet-600/90",
                    variant === "default" && "text-blue-600/90",
                  )}>
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
