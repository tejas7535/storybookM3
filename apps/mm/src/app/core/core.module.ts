import { DecimalPipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { HttpCacheInterceptor, HttpCacheInterceptorModule } from '@ngneat/cashew';
import { TranslocoService } from '@ngneat/transloco';

import { FooterTailwindModule } from '@schaeffler/footer-tailwind';
import { HeaderModule } from '@schaeffler/header';
import { HttpModule } from '@schaeffler/http';
import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { HttpLocaleInterceptor } from '../shared/interceptors/http-locale.interceptor';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StoreModule } from './store/store.module';

export class DynamicLocaleId extends String {
  public constructor(protected translocoService: TranslocoService) {
    super('');
  }

  public toString() {
    return this.translocoService.getActiveLang();
  }
}

@NgModule({
  declarations: [AppComponent, SidebarComponent],
  imports: [
    BrowserAnimationsModule,

    // NgRx Setup
    StoreModule,
    RouterModule,

    ReactiveFormsModule,

    // Angular Material
    MatButtonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,

    // Schaeffler Modules
    HeaderModule,
    FooterTailwindModule,
    IconsModule,

    SharedModule,

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
      'en', // default -> undefined would lead to browser detection
      'en',
      true
    ),

    // HTTP
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),
    HttpModule.forRoot({ environment }),
  ],
  exports: [AppComponent, SidebarComponent],
  providers: [
    {
      provide: LOCALE_ID,
      useClass: DynamicLocaleId,
      deps: [TranslocoService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLocaleInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCacheInterceptor,
      multi: true,
    },
    DecimalPipe,
  ],
})
export class CoreModule {}
