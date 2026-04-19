import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:left-auto sm:right-0 sm:top-auto sm:bottom-0 sm:translate-x-0 sm:flex-col-reverse md:max-w-[400px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full overflow-hidden rounded-2xl border bg-card p-4 pr-10 shadow-elevated backdrop-blur-xl transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-border",
        success: "border-success/20",
        error: "border-destructive/20",
        warning: "border-warning/20",
        info: "border-info/20",
        destructive: "border-destructive/20",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "destructive";

const VARIANT_META: Record<ToastVariant, { Icon: typeof CheckCircle2; iconWrap: string; iconColor: string; bar: string }> = {
  default: { Icon: Info, iconWrap: "bg-muted", iconColor: "text-muted-foreground", bar: "bg-muted-foreground/40" },
  success: { Icon: CheckCircle2, iconWrap: "bg-success/15", iconColor: "text-success", bar: "bg-success" },
  error: { Icon: XCircle, iconWrap: "bg-destructive/15", iconColor: "text-destructive", bar: "bg-destructive" },
  destructive: { Icon: XCircle, iconWrap: "bg-destructive/15", iconColor: "text-destructive", bar: "bg-destructive" },
  warning: { Icon: AlertTriangle, iconWrap: "bg-warning/15", iconColor: "text-warning", bar: "bg-warning" },
  info: { Icon: Info, iconWrap: "bg-info/15", iconColor: "text-info", bar: "bg-info" },
};

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      duration?: number;
    }
>(({ className, variant, children, duration = 4000, ...props }, ref) => {
  const v = (variant ?? "default") as ToastVariant;
  const meta = VARIANT_META[v] ?? VARIANT_META.default;
  const Icon = meta.Icon;
  return (
    <ToastPrimitives.Root
      ref={ref}
      duration={duration}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className={cn("h-10 w-10 shrink-0 rounded-full flex items-center justify-center mr-3", meta.iconWrap)}>
        <Icon className={cn("h-5 w-5", meta.iconColor)} />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
      <span
        className={cn("absolute bottom-0 left-0 h-1 rounded-b-2xl", meta.bar)}
        style={{ animation: `toast-progress ${duration}ms linear forwards` }}
      />
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-input bg-transparent px-3 text-xs font-semibold ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mt-2",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-muted-foreground opacity-60 transition-opacity hover:text-foreground hover:opacity-100 focus:opacity-100 focus:outline-none",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold text-foreground leading-tight", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-xs text-muted-foreground mt-0.5 leading-relaxed", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
