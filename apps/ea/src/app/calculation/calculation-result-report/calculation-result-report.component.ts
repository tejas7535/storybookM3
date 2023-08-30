import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { map } from 'rxjs';

import {
  CalculationParametersFacade,
  CalculationResultFacade,
} from '@ea/core/store';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import { CalculationParametersCalculationTypeConfig } from '@ea/core/store/models';
import { ExpansionPanelComponent } from '@ea/shared/expansion-panel/expansion-panel.component';
import { InfoBannerComponent } from '@ea/shared/info-banner/info-banner.component';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { TagComponent } from '@ea/shared/tag/tag.component';
import { TranslocoService } from '@ngneat/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationDisclaimerComponent } from '../calculation-disclaimer/calculation-disclaimer.component';
import { CalculationResultMessageComponent } from '../calculation-result-information/calculation-result-message.component';
import { CalculationResultReportInputComponent } from '../calculation-result-report-input';
import { CalculationResultReportLargeItemsComponent } from '../calculation-result-report-large-items/calculation-result-report-large-items.component';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection';

@Component({
  templateUrl: './calculation-result-report.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SharedTranslocoModule,
    TagComponent,
    LetDirective,
    MeaningfulRoundPipe,
    CalculationTypesSelectionComponent,
    CalculationResultReportInputComponent,
    CalculationResultMessageComponent,
    InfoBannerComponent,
    ExpansionPanelComponent,
    CalculationResultReportLargeItemsComponent,
    QualtricsInfoBannerComponent,
  ],
})
export class CalculationResultReportComponent {
  public meaingfulRoundPipe = new MeaningfulRoundPipe(this.locale);

  public co2ResultItem$ =
    this.calculationResultFacade.calculationReportCO2Emission$.pipe(
      map((result) => {
        const unit = this.translocoSevice.translate(
          'calculationResultReport.co2Emissions.unit'
        );

        return [
          {
            value: this.meaingfulRoundPipe.transform(result.co2_upstream),
            unit: 'kg',
            short: unit,
            title: 'upstreamTitle',
          },
        ];
      })
    );

  constructor(
    public readonly calculationResultFacade: CalculationResultFacade,
    public readonly productSelectionFacade: ProductSelectionFacade,
    public readonly calculationParametersFacade: CalculationParametersFacade,
    public readonly dialogRef: MatDialogRef<CalculationResultReportComponent>,
    @Inject(LOCALE_ID)
    private readonly locale: string,
    private readonly dialog: MatDialog,
    private readonly translocoSevice: TranslocoService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  showCalculationDisclaimerDialog() {
    this.dialog.open(CalculationDisclaimerComponent, {
      hasBackdrop: true,
      autoFocus: true,
    });
  }

  scrollIntoView(itemName: CalculationParametersCalculationTypeConfig['name']) {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'start',
    };
    document.querySelector(`#${itemName}`)?.scrollIntoView(scrollOptions);
  }
}
