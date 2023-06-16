import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { AppShellComponent } from './components/app-shell/app-shell.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  declarations: [AppShellComponent, UserPanelComponent],
  exports: [AppShellComponent],
})
export class AppShellModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }
}
