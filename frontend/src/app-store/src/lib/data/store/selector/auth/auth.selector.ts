import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from '../../reducer/auth/auth.reducer';

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
