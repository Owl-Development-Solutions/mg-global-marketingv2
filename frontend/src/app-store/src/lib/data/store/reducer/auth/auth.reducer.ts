import { createReducer, on } from '@ngrx/store';
import { AuthUserResponse, UserResponseModel } from '../../../models';
import * as fromAuth from '../../actions/auth/auth-actions';
export const authFeatureKey = 'authz';

export interface AuthState {
  data?: UserResponseModel;
  userData?: UserResponseModel;
  loading: boolean;
  loaded: boolean;
  error?: string | null;
  isAuthenticated?: boolean;
}

export const initialAuthState: AuthState = {
  data: undefined,
  loading: false,
  loaded: false,
  error: null,
  isAuthenticated: false,
};

export const initiateAuthReducer = createReducer(
  initialAuthState,
  on(fromAuth.initiateAuthAttempted, (state) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      error: null,
    };
  }),
  on(fromAuth.initiateSucceeded, (state, { data }) => {
    return {
      ...state,
      data,
      loaded: true,
      loading: false,
      error: null,
      isAuthenticated: true,
    };
  }),
  on(fromAuth.initiateAuthFailed, (state, { data, error }) => ({
    ...state,
    data: data as any,
    error: error,
    loading: false,
    loaded: false,
    isAuthenticated: false,
  })),
  // on(fromAuth.refreshTokenSucceed, (state, { data }) => {
  //   return {
  //     ...state,
  //     data,
  //   };
  // }),
  // on(fromAuth.refreshTokenFailed, (state, { error }) => {
  //   return {
  //     ...state,
  //   };
  // }),
  on(fromAuth.logoutAttempted, () => ({
    ...initialAuthState,
  })),
  on(fromAuth.updateUserProfile, (state, { data }) => {
    if (!state.data) return state;
    
    return {
      ...state,
      data: {
        ...state.data,
        attributes: {
          ...state.data.attributes,
          ...data,
        },
      },
    };
  }),
);
