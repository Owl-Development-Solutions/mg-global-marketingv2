import { createReducer, on } from '@ngrx/store';
import { AuthUserResponse } from '../../../models';
import * as fromAuth from '../../actions/auth/auth-actions';

export const authFeatureKey = 'authz';

export interface AuthState {
  data: AuthUserResponse | null;
  loading: boolean;
  loaded: boolean;
  error?: string | null;
}

export const initialState: AuthState = {
  data: null,
  loading: false,
  loaded: false,
  error: null,
};

export const initiateAuthReducer = createReducer(
  initialState,
  on(fromAuth.initiateAuthAttempted, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(fromAuth.initiateSucceeded, (state, { data }) => ({
    ...state,
    data: data,
    loaded: true,
    loading: false,
    error: null,
  })),
  on(fromAuth.initiateAuthFailed, (state, { data, error }) => ({
    ...state,
    data: data as any,
    error: error,
    loading: false,
    loaded: false,
  })),
);
