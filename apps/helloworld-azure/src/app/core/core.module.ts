import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';

import { AuthGuard } from './guards/auth.guard';
import { StoreModule } from './store/store.module';

export const storageFactory = (): OAuthStorage => localStorage;

@NgModule({
  imports: [
    OAuthModule.forRoot(),
    // NgRx Setup
    StoreModule,
    RouterModule,
  ],
  providers: [AuthGuard],
})
export class CoreModule {}
