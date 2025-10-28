import { UserResponseModel, UserResponseState } from '../../../models';
import { createReducer, on } from '@ngrx/store';
import * as fromUser from '../../actions/user/user-actions';

export const userFeatureKey = 'user';

export interface UserState {
  data?: UserResponseModel;
  loading: boolean;
  loaded: boolean;
  error?: string | null;
}

export const initialUserState: UserState = {
  data: undefined,
  loading: false,
  loaded: false,
  error: null,
};

export const initiateUserReducer = createReducer(
  initialUserState,
  on(fromUser.getUserByTokenSucceeded, (state, { data }) => {
    return {
      ...state,
      data,
      loaded: true,
      loading: false,
      error: null,
    };
  }),
);
