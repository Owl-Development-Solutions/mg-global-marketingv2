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

export const genealogyTreeLoaded = createSelector(
  geonologyState,
  (state) => state?.loaded,
);

export const genealogyTreeLoading = createSelector(
  geonologyState,
  (state) => state.loading,
);

export const genealogyLoadingAddedAttempted = createSelector(
  geonologyState,
  (state) => state.loadingAttempted,
);
