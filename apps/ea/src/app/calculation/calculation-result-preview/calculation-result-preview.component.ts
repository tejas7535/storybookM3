import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TrackingService } from '@ea/core/services/tracking-service/tracking.service';
import { CalculationParametersFacade, SettingsFacade } from '@ea/core/store';
import { CalculationResultFacade } from '@ea/core/store/facades/calculation-result/calculation-result.facade';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultPreviewEmissionsTooltipComponent } from '../calculation-result-preview-emissions-tooltip/calculation-result-preview-emissions-tooltip.component';
import { CalculationResultPreviewErrorsComponent } from '../calculation-result-preview-errors/calculation-result-preview-errors.component';
import { CalculationResultPreviewItemComponent } from '../calculation-result-preview-item/calculation-result-preview-item.component';
import { CalculationResultReportComponent } from '../calculation-result-report/calculation-result-report.component';
import { OverrollingFrequenciesPreviewItemComponent } from '../overrolling-frequencies-preview-iterm/overrolling-frequencies-preview-item.component';

@Component({
  selector: 'ea-calculation-result-preview',
  templateUrl: './calculation-result-preview.component.html',
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
    CalculationResultPreviewEmissionsTooltipComponent,
    LetDirective,
    CalculationResultPreviewErrorsComponent,
  ],
})
export class CalculationResultPreviewComponent {
  @Input() sticky = true;
  public errorsExpanded = false;

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
  public calculationErrors$ =
    this.calculationResultFacade.calculationReportErrors$;
  public calculationGeneralError$ =
    this.calculationResultFacade.isCalculationGeneralError$;

  public isStandalone$ = this.settingsFacade.isStandalone$;

  constructor(
    private readonly calculationResultFacade: CalculationResultFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly analyticsService: TrackingService,
    private readonly settingsFacade: SettingsFacade,
    private readonly dialog: Dialog
  ) {}

  showReport() {
    this.analyticsService.logShowReport();
    this.dialog.open(CalculationResultReportComponent, { id: 'result-report' });
  }
}
