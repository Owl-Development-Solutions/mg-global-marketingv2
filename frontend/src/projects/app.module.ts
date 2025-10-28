import { NgModule, provideAppInitializer } from '@angular/core';
import { AppComponent } from './app.component';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppStoreModule } from '@app-store/lib/app-store.module';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { reducers } from '@app-store/public-api';
import { TokenInterceptor } from '@app-store/lib/data/interceptors';

export const extModules = [
  StoreDevtoolsModule.instrument({
    maxAge: 25,
    connectInZone: true,
  }),
];

const PERSISTED_KEYS = [
  {
    user: {
      filter: ['data'],
    },
  },
  {
    authz: {
      filter: ['data', 'isAuthenticated'],
    },
  },
];
export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({
    keys: PERSISTED_KEYS as any,
    rehydrate: true,
    storage: localStorage,
  })(reducer);
}

// --- 4. Define the meta-reducers array ---
const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterOutlet,
    AppStoreModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    EffectsModule.forRoot([]),
    extModules,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    provideAppInitializer(() => new Promise((resolve) => setTimeout(resolve))),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
