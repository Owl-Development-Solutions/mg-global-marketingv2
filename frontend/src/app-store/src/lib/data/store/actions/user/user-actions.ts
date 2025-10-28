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
  props<{ data: UserResponseModel }>(),
);

export const getUserByIdAttempted = createAction(
  '[User] Initiate User Attempted',
  props<{ userId: string }>(),
);

export const getUserByIdFailed = createAction(
  '[User] Initiate User Failed',
  props<{ error: string }>(),
);

export const getUserByIdSucceeded = createAction(
  '[User] Initiate User Succeeded',
  props<{ data: UserResponseModel }>(),
);
