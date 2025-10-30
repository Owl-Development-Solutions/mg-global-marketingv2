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

export const getUserName = createSelector(
  getUserProfile,
  (user: UserResponseModel | undefined) => {
    if (user) {
      return {
        firstName: user.attributes.firstName,
        lastName: user.attributes.lastName,
      };
    }
    return null;
  },
);

export const getUserInfo = createSelector(
  getUserProfile,
  (user: UserResponseModel | undefined) => {
    if (user) {
      return {
        firstName: user.attributes.firstName,
        lastName: user.attributes.lastName,
        username: user.attributes.username,
        email: user.attributes.email,
      };
    }
    return null;
  },
);

export const getUserid = createSelector(
  getUserProfile,
  (user: UserResponseModel | undefined) => user && user.id,
);
