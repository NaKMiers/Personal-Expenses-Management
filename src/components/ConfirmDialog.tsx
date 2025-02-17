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
}

function ConfirmDialog({
  trigger,
  label,
  subLabel,
  confirmLabel,
  cancelLabel,
  onConfirm,
  disabled = false,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger disabled={disabled}>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="px-21/2 md:px-21 border-none outline-none">
        <div className="border-light p-21 flex flex-col gap-4 rounded-md border-2 bg-neutral-950">
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
