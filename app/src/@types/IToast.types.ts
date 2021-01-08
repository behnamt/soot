export interface IToast {
  id: string;
  content: string;
  autoHide: boolean;
  type?: EToastTypes;
}

export interface IToastProps {
  remove: () => void;
  content: string;
  autoHide: boolean;
  type?: EToastTypes;
}

export interface IToastContext {
  add: (content: string) => void;
  remove: (id: string) => void;
  toasts: IToast[];
}

export enum EToastTypes {
  INFO = 'info',
  WARNING = 'warning',
  ALERT = 'alert',
  SUCCESS = 'success',
}

export enum EToastColors {
  LIGHT = 'light',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ALERT = 'danger',
}
