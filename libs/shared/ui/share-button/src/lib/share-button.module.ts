import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoService } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';
import { ShareButtonComponent } from './share-button/share-button.component';
import { ShareButtonDirective } from './share-button/share-button.directive';

@NgModule({
  declarations: [ShareButtonComponent, ShareButtonDirective],
  imports: [
    // angular
    CommonModule,

    // ui
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule,

    // shared
    SharedTranslocoModule,
  ],
  exports: [ShareButtonComponent, ShareButtonDirective],
})
export class ShareButtonModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }
}
