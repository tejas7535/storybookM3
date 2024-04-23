import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { HtmlReportComponent } from './components/html-report/html-report.component';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import jaJson from './i18n/ja.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    PushPipe,
    TranslocoModule,

    // Angular Material
    MatExpansionModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  declarations: [HtmlReportComponent, SafeHtmlPipe],
  exports: [HtmlReportComponent],
})
export class ReportModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(jaJson, 'ja');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }
}
