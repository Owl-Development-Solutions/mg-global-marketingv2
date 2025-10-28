export interface CallbackOnFailureModel {
  errorMsg: string;
}

export interface Callbacks {
  onSuccess: (data?: any) => void;
  onFailure?: (error: CallbackOnFailureModel) => void;
}

export interface ErrorProps {
  title: string;
  errorType: string;
  message: string;
  showClose: boolean;
}
