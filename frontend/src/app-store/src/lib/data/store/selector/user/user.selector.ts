import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from '../../reducer/user/user.reducer';
import { UserResponseModel, UserResponseState } from '../../../models';

export const selectUserState = createFeatureSelector<fromAuth.UserState>(
  fromAuth.userFeatureKey,
);

export const getUserProfile = createSelector(
  selectUserState,
  (state: fromAuth.UserState) => state && state?.data,
);

export const getAccessToken = createSelector(
  selectUserState,
  (state: fromAuth.UserState) => state && state.data?.accessToken,
);
