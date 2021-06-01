import { DecimalPipe } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslocoService } from '@ngneat/transloco';

import { FooterTailwindModule } from '@schaeffler/footer-tailwind';
import { HeaderModule } from '@schaeffler/header';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { environment } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StoreModule } from './store/store.module';

export class DynamicLocaleId extends String {
  constructor(protected translocoService: TranslocoService) {
    super('');
  }

  toString() {
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

    // UI Modules
    HeaderModule,
    MatButtonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FooterTailwindModule,

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
  ],
  exports: [AppComponent, SidebarComponent],
  providers: [
    {
      provide: LOCALE_ID,
      useClass: DynamicLocaleId,
      deps: [TranslocoService],
    },
    DecimalPipe,
  ],
})
export class CoreModule {}
