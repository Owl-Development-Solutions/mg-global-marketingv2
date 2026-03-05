import { createAction, props } from '@ngrx/store';

export const uploadUserImageAttempted = createAction(
  '[User] Initiate Image Upload Attempted',
  props<{ userId: string; file: File }>(),
);

export const uploadUserImageFailed = createAction(
  '[User] Initiate Image Upload Failed',
  props<{ error: string }>(),
);

export const uploadUserImageSucceeded = createAction(
  '[User] Initiate Image Upload Succeeded',
  props<{ resp: string }>(),
);
