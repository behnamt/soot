import React, { useEffect, useRef, PropsWithChildren } from 'react';
import { Alert } from '@material-ui/lab';

interface IToastProps {
  onRemove: () => void;
}

export const Toast: React.FC<PropsWithChildren<IToastProps>> = (props: PropsWithChildren<IToastProps>) => {
  const { onRemove, children } = props;
  const duration = 5000;
  const removeRef = useRef<() => void>();

  removeRef.current = onRemove;

  useEffect(() => {
    const id = setTimeout(() => removeRef.current(), duration);

    return (): void => clearTimeout(id);
  }, []);

  return (
    <Alert severity="success" color="info">
      {children}
    </Alert>
  );
};
