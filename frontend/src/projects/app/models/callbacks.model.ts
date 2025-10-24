export interface CallBacks {
  onSuccess: () => void;
  onFailure: (err: { errorMsg: string }) => void;
}
