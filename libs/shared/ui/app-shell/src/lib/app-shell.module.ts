import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { AppShellComponent } from './components/app-shell/app-shell.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import deutsch from './i18n/de.json';
import english from './i18n/en.json';
import spanish from './i18n/es.json';
import french from './i18n/fr.json';
import indoenesianBahasa from './i18n/id.json';
import italian from './i18n/it.json';
import japanese from './i18n/ja.json';
import korean from './i18n/ko.json';
import russian from './i18n/ru.json';
import thai from './i18n/th.json';
import vietnamese from './i18n/vi.json';
import chineseSimplified from './i18n/zh.json';
import chineseTraditional from './i18n/zh_TW.json';
import { MatButtonModule } from '@angular/material/button';

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
    this.translocoService.setTranslation(deutsch, 'de');
    this.translocoService.setTranslation(english, 'en');
    this.translocoService.setTranslation(spanish, 'es');
    this.translocoService.setTranslation(french, 'fr');
    this.translocoService.setTranslation(italian, 'it');
    this.translocoService.setTranslation(japanese, 'ja');
    this.translocoService.setTranslation(russian, 'ru');
    this.translocoService.setTranslation(chineseSimplified, 'zh');
    this.translocoService.setTranslation(chineseTraditional, 'zh_TW');
    this.translocoService.setTranslation(indoenesianBahasa, 'id');
    this.translocoService.setTranslation(korean, 'ko');
    this.translocoService.setTranslation(thai, 'th');
    this.translocoService.setTranslation(vietnamese, 'vi');
  }
}
