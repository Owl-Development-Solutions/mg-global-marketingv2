import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, StoreModule } from '@ngrx/store';
import * as fromStore from './data/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromStore.authFeatureKey,
      fromStore.initiateAuthReducer,
    ),
    StoreModule.forFeature(
      fromStore.userFeatureKey,
      fromStore.initiateUserReducer,
    ),
    StoreModule.forFeature(
      fromStore.geonologyKey,
      fromStore.initiateGeonologyReducer,
    ),
    EffectsModule.forFeature([
      fromStore.AuthEffects,
      fromStore.UserTokenEffects,
      fromStore.GeonologyEffects,
    ]),
  ],
})
export class AppStoreModule {}
