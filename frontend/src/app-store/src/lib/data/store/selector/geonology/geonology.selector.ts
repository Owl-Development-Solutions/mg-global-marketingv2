import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGeonology from '../../reducer/geonology/geonology.reducer';

export const geonologyState =
  createFeatureSelector<fromGeonology.GeonologyState>(
    fromGeonology.geonologyKey,
  );

export const geonologyData = createSelector(
  geonologyState,
  (state: fromGeonology.GeonologyState) => state && state.tree,
);
