export interface IToast {
  id: string;
  content: any;
  autoHide: boolean;
  type?: EToastTypes;
}

export interface IToastProps {
  remove: any;
  content: any;
  autoHide: boolean;
  type?: EToastTypes;
}

export interface IToastContext {
  add: (content: any) => void;
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
