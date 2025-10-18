import { createAction, props } from '@ngrx/store';
import { AuthUserResponse } from '../../../models';

export const initiateAuthAttempted = createAction(
  '[Auth] Initiate Auth Attempted',
  props<{ data: { email: string; password: string } }>(),
);

export const initiateAuthFailed = createAction(
  '[Auth] Initiate Auth Failed',
  props<{ data: { email: string; password: string }; error: any }>(),
);

export const initiateSucceeded = createAction(
  '[Auth] Initiate Auth Succeeded',
  props<{ data: AuthUserResponse }>(),
);
