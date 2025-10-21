import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { initiateUserReducer, userFeatureKey, UserState } from '../../reducer';

export interface AppState {
  [userFeatureKey]: UserState;
}

export const reducers: ActionReducerMap<AppState> = {
  [userFeatureKey]: initiateUserReducer,
};
