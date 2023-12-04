import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EmbeddedGoogleAnalyticsService } from '@ea/core/services/embedded-google-analytics';
import { CalculationParametersFacade, SettingsFacade } from '@ea/core/store';
import { CalculationResultFacade } from '@ea/core/store/facades/calculation-result/calculation-result.facade';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultPreviewItemComponent } from '../calculation-result-preview-item/calculation-result-preview-item.component';
import { CalculationResultReportComponent } from '../calculation-result-report/calculation-result-report.component';
import { OverrollingFrequenciesPreviewItemComponent } from '../overrolling-frequencies-preview-iterm/overrolling-frequencies-preview-item.component';

@Component({
  selector: 'ea-calculation-result-preview',
  templateUrl: './calculation-result-preview.html',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    CalculationResultPreviewItemComponent,
    OverrollingFrequenciesPreviewItemComponent,
    SharedTranslocoModule,
    MatProgressSpinnerModule,
  ],
})
export class CalculationResultPreviewComponent {
  @Input() sticky = true;

  public overlayData$ =
    this.calculationResultFacade.getCalculationResultPreviewData$;
  public isCalculationResultReportAvailable$ =
    this.calculationResultFacade.isCalculationResultReportAvailable$;
  public isAnyServiceLoading$ =
    this.calculationParametersFacade.isAnyServiceLoading$;
  public isCalculationImpossible$ =
    this.calculationResultFacade.isCalculationImpossible$;
  public isCalculationMissingInput$ =
    this.calculationParametersFacade.isCalculationMissingInput$;
  public loadcaseCount$ = this.calculationParametersFacade.getLoadcaseCount$;
  public selectedLoadcase$ =
    this.calculationParametersFacade.getSelectedLoadcase$;

  public isStandalone$ = this.settingsFacade.isStandalone$;

  constructor(
    private readonly calculationResultFacade: CalculationResultFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly analyticsService: EmbeddedGoogleAnalyticsService,
    private readonly settingsFacade: SettingsFacade,
    private readonly dialog: Dialog
  ) {}

  showReport() {
    this.analyticsService.logShowReport();
    this.dialog.open(CalculationResultReportComponent, { id: 'result-report' });
  }
}
