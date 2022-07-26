import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';

import { LabelValueModule } from '@schaeffler/label-value';

import { HtmlReportComponent } from './components/html-report/html-report.component';
import { ReportComponent } from './components/report/report.component';
import { GreaseReportComponent } from './grease/grease-report/grease-report.component';
import { GreaseReportInputComponent } from './grease/grease-report-input/grease-report-input.component';
import { GreaseReportInputItemComponent } from './grease/grease-report-input-item/grease-report-input-item.component';
import { GreaseResultComponent } from './grease/grease-result/grease-result.component';
import { UndefinedValuePipe } from './grease/pipes/undefined-value.pipe';
import { GreaseReportService } from './grease/services/grease-report.service';
import { GreaseResultDataSourceService } from './grease/services/grease-result-data-source.service';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    PushModule,
    TranslocoModule,

    LabelValueModule,

    // Angular Material
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  providers: [
    GreaseReportService,
    GreaseResultDataSourceService,
    UndefinedValuePipe,
  ],
  declarations: [
    ReportComponent,
    GreaseReportComponent,
    GreaseResultComponent,
    GreaseReportInputComponent,
    GreaseReportInputItemComponent,
    HtmlReportComponent,
    SafeHtmlPipe,
    UndefinedValuePipe,
  ],
  exports: [ReportComponent, GreaseReportComponent, HtmlReportComponent],
})
export class ReportModule {
  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(zhJson, 'zh');
  }
}
