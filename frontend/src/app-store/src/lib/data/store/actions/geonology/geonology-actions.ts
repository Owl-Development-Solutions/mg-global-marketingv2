import { Callbacks, GeonologyNode } from '../../../models';
import { createAction, props } from '@ngrx/store';

export const addUserGeonologyAttempted = createAction(
  '[Geonology] Add User Geonology Attempted',
  props<{
    parentUserName: string;
    side: string;
    child: GeonologyNode;
    activationCodeId: string;
    callBacks: Callbacks;
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

export const getGenealogyAttempted = createAction(
  '[Genealogy] Get Genealogy By UserId Attempted',
  props<{ userId: string }>(),
);

export const getGenealogyFailed = createAction(
  '[Genealogy] Get Genealogy By UserId Failed',
  props<{ error: string }>(),
);

export const getGenealogySucceeded = createAction(
  '[Genealogy] Get Genealogy By UserId Succeeded',
  props<{ data: GeonologyNode }>(),
);
