import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppShellModule } from '@schaeffler/app-shell';
import { FooterModule } from '@schaeffler/footer';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { HttpGreaseInterceptor } from '../shared/interceptors/http-grease.interceptor';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule,

    // UI Modules
    AppShellModule,
    SharedModule,

    // Material Modules
    MatSidenavModule,

    // Translation
    SharedTranslocoModule.forRoot(
      environment.production,
      [
        { id: 'de', label: 'Deutsch' },
        { id: 'en', label: 'English' },
        { id: 'es', label: 'Español' },
        { id: 'fr', label: 'Français' },
        { id: 'ru', label: 'русский' },
        { id: 'zh', label: '中国' },
      ],
      'de', // default -> undefined would lead to browser detection
      'en',
      true,
      !environment.localDev
    ),

    // HTTP
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpGreaseInterceptor,
      multi: true,
    },
  ],
  exports: [FooterModule, AppShellModule, StoreModule],
})
export class CoreModule {}
