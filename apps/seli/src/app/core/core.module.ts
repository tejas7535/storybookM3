import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '@schaeffler/header';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { AuthGuard } from './auth.guard';
import { StoreModule } from './store/store.module';

@NgModule({
  declarations: [AppComponent],
  providers: [AuthGuard],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,

    // UI Modules
    HeaderModule,
    MatButtonModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      ['en'],
      'en', // default -> undefined would lead to browser detection
      'en',
      true
    ),
  ],
  exports: [AppComponent],
})
export class CoreModule {}
