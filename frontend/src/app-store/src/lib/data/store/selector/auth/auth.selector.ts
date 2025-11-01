import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from '../../reducer/auth/auth.reducer';
import { UserResponseModel } from '@app-store/public-api';

export const selectAuthState = createFeatureSelector<fromAuth.AuthState>(
  fromAuth.authFeatureKey,
);

export const getAuthProfile = createSelector(
  selectAuthState,
  (state: fromAuth.AuthState) => state && state?.data,
);

export const isLoading = createSelector(
  selectAuthState,
  (state: fromAuth.AuthState) => state.loading,
);

export const authError = createSelector(
  selectAuthState,
  (state: fromAuth.AuthState) => state.error,
);

export const getAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);

export const getRefreshToken = createSelector(
  selectAuthState,
  (state) => state.data?.refreshToken,
);

export const getAccessTokenz = createSelector(
  selectAuthState,
  (state) => state.data?.accessToken,
);

export const getUserInfo = createSelector(
  getAuthProfile,
  (user: UserResponseModel | undefined) => {
    console.log(`uesr`, user);

    if (user) {
      return {
        firstName: user.attributes?.firstName,
        lastName: user.attributes?.lastName,
        username: user.attributes?.username,
        email: user.attributes?.email,
      };
    }
    return null;
  },
);

export const getUserName = createSelector(
  getAuthProfile,
  (user: UserResponseModel | undefined) => {
    if (user) {
      return {
        firstName: user.attributes?.firstName,
        lastName: user.attributes?.lastName,
      };
    }
    return null;
  },
);

export const getUserid = createSelector(
  getAuthProfile,
  (user: UserResponseModel | undefined) => user && user?.id,
);
