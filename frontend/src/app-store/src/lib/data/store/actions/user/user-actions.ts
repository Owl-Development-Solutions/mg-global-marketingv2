import { UserResponseModel } from '@app-store/lib/data/models/user.attributes.model';
import { createAction, props } from '@ngrx/store';

export const getUserByTokenAttempted = createAction(
  '[User] Initiate User Attempted',
  props<{ token: string }>(),
);

export const getUserByTokenFailed = createAction(
  '[User] Initiate User Failed',
  props<{ error: string }>(),
);

export const getUserByTokenSucceeded = createAction(
  '[User] Initiate User Succeeded',
  props<{ data: any }>(),
);
