import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';
import { AlertTriangle, X } from 'lucide-react';

// Modal de confirmación accesible (role="alertdialog" implícito vía Headless UI
// cuando hay un título descriptivo). Incluye focus trap, Escape, backdrop click,
// y animaciones vía tailwindcss-animate.
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="p-5 text-center sm:p-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
                  <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                </div>

                <DialogTitle className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {title}
                </DialogTitle>
                <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{message}</p>

                <div className="flex w-full items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/30 transition-colors hover:bg-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus:ring-offset-slate-900"
                  >
                    {confirmText}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:hover:bg-slate-800"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmModal;