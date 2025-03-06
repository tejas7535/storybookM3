import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultReportInput } from '../models/calculation-result-report-input.model';
import csJson from './../../i18n/cs.json';
import deJson from './../../i18n/de.json';
import enJson from './../../i18n/en.json';
import esJson from './../../i18n/es.json';
import frJson from './../../i18n/fr.json';
import itJson from './../../i18n/it.json';
import jaJson from './../../i18n/ja.json';
import koJson from './../../i18n/ko.json';
import plJson from './../../i18n/pl.json';
import ptJson from './../../i18n/pt.json';
import ruJson from './../../i18n/ru.json';
import thJson from './../../i18n/th.json';
import trJson from './../../i18n/tr.json';
import viJson from './../../i18n/vi.json';
import zhJson from './../../i18n/zh.json';
import zhTWJson from './../../i18n/zh_TW.json';
import { CalculationResultReportInputComponent } from './calculation-result-report-input';
import { ReportExpansionPanelComponent } from './report-expansion-panel/report-expansion-panel.component';
import { ReportMessagesComponent } from './report-messages/report-messages.component';
import { ReportMessages } from './report-messages/report-messages.component.interface';
import { ResultReportComponentInterface } from './result-report.component.interface';

@Component({
  selector: 'schaeffler-result-report',
  templateUrl: './result-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedTranslocoModule,
    ReportMessagesComponent,
    CalculationResultReportInputComponent,
    ReportExpansionPanelComponent,
  ],
})
export class ResultReportComponent implements ResultReportComponentInterface {
  @Input() public reportInputs: CalculationResultReportInput[] | undefined;
  @Input() public bearinxVersions?: string;
  @Input() public messages: ReportMessages = {
    notes: [],
    errors: [],
    warnings: [],
  };

  @Input() public isMessageSectionExpanded = false;

  public constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.setTranslation(enJson, 'en');
    this.translocoService.setTranslation(deJson, 'de');
    this.translocoService.setTranslation(csJson, 'cs');
    this.translocoService.setTranslation(esJson, 'es');
    this.translocoService.setTranslation(frJson, 'fr');
    this.translocoService.setTranslation(itJson, 'it');
    this.translocoService.setTranslation(jaJson, 'ja');
    this.translocoService.setTranslation(koJson, 'ko');
    this.translocoService.setTranslation(plJson, 'pl');
    this.translocoService.setTranslation(ptJson, 'pt');
    this.translocoService.setTranslation(ruJson, 'ru');
    this.translocoService.setTranslation(thJson, 'th');
    this.translocoService.setTranslation(trJson, 'tr');
    this.translocoService.setTranslation(viJson, 'vi');
    this.translocoService.setTranslation(zhTWJson, 'zh_TW');
    this.translocoService.setTranslation(zhJson, 'zh');
  }
}
