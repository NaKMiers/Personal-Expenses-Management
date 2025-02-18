import { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'

interface ConfirmDialogProps {
  trigger: ReactNode
  label: string
  subLabel: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  disabled?: boolean
  className?: string
}

function ConfirmDialog({
  trigger,
  label,
  subLabel,
  confirmLabel,
  cancelLabel,
  onConfirm,
  disabled = false,
  className = '',
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={disabled}
        className={`h-full w-full ${className}`}
      >
        {trigger}
      </AlertDialogTrigger>

      <AlertDialogContent className="border-none px-21/2 outline-none md:px-21">
        <div className="flex flex-col gap-4 rounded-md border-2 border-light bg-neutral-950 p-21">
          <AlertDialogHeader>
            <AlertDialogTitle>{label}</AlertDialogTitle>
            <AlertDialogDescription>{subLabel}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row items-center justify-end gap-2">
            <AlertDialogCancel className="mt-0 h-8 px-2 text-sm">{cancelLabel}</AlertDialogCancel>
            <AlertDialogAction
              className="mt-0 h-8 px-2 text-sm"
              onClick={onConfirm}
            >
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default ConfirmDialog
