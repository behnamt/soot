import React, { useCallback, useContext, useState, PropsWithChildren } from 'react';
import { IToast, IToastContext, EToastTypes } from '../@types/IToast.types';
import { Toast } from '../components/Toast/Toast';

const ToastContext = React.createContext<IToastContext>({
  add: () => null,
  remove: () => null,
  toasts: [],
});

const useToast = (): IToastContext => useContext(ToastContext);

const useToastProvider = (): IToastContext => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const add = useCallback(
    (content, autoHide = true, type: EToastTypes = EToastTypes.INFO): void => {
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);

      setToasts([
        ...toasts,
        {
          id,
          content,
          autoHide,
          type,
        },
      ]);
    },
    [toasts],
  );

  const remove = useCallback(
    (id): void => {
      setToasts(toasts.filter((toast): boolean => toast.id !== id));
    },
    [toasts],
  );

  return { toasts, add, remove };
};

const ToastProvider = ({ children }: PropsWithChildren<any>) => {
  const providerValue = useToastProvider();

  return (
    <ToastContext.Provider value={providerValue}>
      {providerValue.toasts.map((toast) => (
        <Toast key={toast.id} onRemove={(): void => providerValue.remove(toast.id)}>
          {toast.content}
        </Toast>
      ))}
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastProvider, useToast };
