import { createAction, props } from '@ngrx/store';
import {
  AuthUserResponse,
  Callbacks,
  RegisterData,
  UserResponseModel,
} from '../../../models';

export const initiateRegisterUserAttempted = createAction(
  '[Auth] Initiate Register User Attempted',
  props<{ data: RegisterData; callBacks: Callbacks }>(),
);

export const initiateRegisterUserFailed = createAction(
  '[Auth] Initiate Register User Failed',
  props<{ error: any }>(),
);

export const initiateRegisterUserSucceeded = createAction(
  '[Auth] Initiate Register User Succeeded ',
  props<{ response: string }>(),
);

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
  props<{ data: UserResponseModel }>(),
);

export const rehydrateAuth = createAction(
  '[Auth] Rehydrate Auth',
  props<{ accessToken: string; refreshToken: string }>(),
);

export const refreshTokenSucceed = createAction(
  '[Auth] Initiate Refresh Token Succeeded',
  props<{ data: AuthUserResponse }>(),
);

export const refreshTokenFailed = createAction(
  '[Auth] Initiate Refresh Token Failed',
  props<{ error: any }>(),
);

export const logoutAttempted = createAction('[Auth] Logout Attempted');

export const updateUserProfile = createAction(
  '[Auth] Update User Profile',
  props<{ data: Partial<UserResponseModel> }>(),
);
