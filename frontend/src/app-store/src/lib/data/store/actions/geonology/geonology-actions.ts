import { GeonologyNode } from '@app-store/public-api';
import { createAction, props } from '@ngrx/store';

export const addUserGeonologyAttempted = createAction(
  '[Geonology] Add User Geonology Attempted',
  props<{
    parentUserName: string;
    side: string;
    child: GeonologyNode;
  }>(),
);

export const addUserGeonologyFailed = createAction(
  '[Geonology] Add User Geonology Failed',
  props<{ error: string }>(),
);

export const addUserGeonologySucceded = createAction(
  '[Geonology] Add User Geonology Succeeded',
  props<{
    parentUserName: string;
    side: string;
    child: GeonologyNode;
  }>(),
);
