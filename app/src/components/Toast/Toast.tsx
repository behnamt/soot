import React, { useEffect, useRef, PropsWithChildren } from 'react';
import { Alert } from '@material-ui/lab';

interface IToastProps {
  onRemove: Function;
}

export const Toast: React.FC<PropsWithChildren<IToastProps>> = (props: PropsWithChildren<IToastProps>) => {
  const { onRemove, children } = props;
  const duration = 5000;
  const removeRef: any = useRef();

  removeRef.current = onRemove;

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const id = setTimeout(() => removeRef.current(), duration);

    return () => clearTimeout(id);
    // eslint-disable-next-line
  }, []);

  return (
    <Alert severity="success" color="info">
      {children}
    </Alert>
  );
};
