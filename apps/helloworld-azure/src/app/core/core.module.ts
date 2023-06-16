import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { PushPipe } from '@ngrx/component';

import { AppShellModule } from '@schaeffler/app-shell';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,

    // UI Modules
    AppShellModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en', 'de'],
      'en', // default -> undefined would lead to browser detection
      'en',
      undefined, // language storage key -> language is not persisted in this app
      true,
      !environment.localDev
    ),
    PushPipe,
  ],
  providers: [],
  exports: [AppComponent],
})
export class CoreModule {}
