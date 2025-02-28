import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { map } from 'rxjs';

import { PDFReportService } from '@ea/core/services/pdf-report.service';
import { PdfFileSaveService } from '@ea/core/services/pdfreport/pdf-file-save.service';
import { TrackingService } from '@ea/core/services/tracking-service/tracking.service';
import {
  CalculationParametersFacade,
  CalculationResultFacade,
  SettingsFacade,
} from '@ea/core/store';
import { Co2DownstreamFacade } from '@ea/core/store/facades/calculation-result/co2-downstream.facade';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import { CalculationParametersCalculationTypeConfig } from '@ea/core/store/models';
import { AppStoreButtonsComponent } from '@ea/shared/app-store-buttons/app-store-buttons.component';
import { InfoBannerComponent } from '@ea/shared/info-banner/info-banner.component';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TranslocoDecimalPipe } from '@jsverse/transloco-locale';
import { LetDirective, PushPipe } from '@ngrx/component';

import {
  InfoButtonComponent,
  ReportExpansionPanelComponent,
  ResultReportComponent,
} from '@schaeffler/result-report';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationResultReportEmissionComponent } from '../calculation-result-report-emission/calculation-result-report-emission.component';
import { CalculationResultReportLargeItemsComponent } from '../calculation-result-report-large-items/calculation-result-report-large-items.component';
import { CalculationResultReportSelectionComponent } from '../calculation-result-report-selection/calculation-result-report-selection.component';

@Component({
  templateUrl: './calculation-result-report.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SharedTranslocoModule,
    LetDirective,
    TranslocoModule,
    ReportExpansionPanelComponent,
    InfoBannerComponent,
    CalculationResultReportLargeItemsComponent,
    QualtricsInfoBannerComponent,
    DialogModule,
    CalculationResultReportSelectionComponent,
    ResultReportComponent,
    AppStoreButtonsComponent,
    CalculationResultReportEmissionComponent,
    InfoButtonComponent,
  ],
  providers: [TranslocoDecimalPipe, MeaningfulRoundPipe],
})
export class CalculationResultReportComponent {
  @ViewChild(CalculationResultReportEmissionComponent, { static: false })
  private readonly emissionComponent?: CalculationResultReportEmissionComponent;

  public co2ResultItem$ =
    this.calculationResultFacade.calculationReportCO2Emission$.pipe(
      map((result) => {
        const unit = this.translocoSevice.translate(
          'calculationResultReport.co2Emissions.unit'
        );

        const productionTooltip = this.translocoSevice.translate(
          'calculationResult.productionTooltip'
        );

        return [
          {
            value: result.co2_upstream,
            unit: 'kg',
            short: unit,
            title: 'upstreamTitle',
            titleTooltip: productionTooltip,
          },
        ];
      })
    );

  public bearingDesignation$ = this.productSelectionFacade.bearingDesignation$;
  public downstreamErrors$ = this.downstreamCalculationFacade.downstreamErrors$;

  public reportErrors$ = this.calculationResultFacade.getAllErrors$;
  public bearinxVersions$ = this.calculationResultFacade.getBearinxVersions$;

  constructor(
    public readonly calculationResultFacade: CalculationResultFacade,
    public readonly productSelectionFacade: ProductSelectionFacade,
    public readonly calculationParametersFacade: CalculationParametersFacade,
    public readonly downstreamCalculationFacade: Co2DownstreamFacade,
    public readonly dialogRef: DialogRef<CalculationResultReportComponent>,
    public readonly settingsFacade: SettingsFacade,
    private readonly translocoSevice: TranslocoService,
    private readonly trackingService: TrackingService,
    private readonly reportService: PDFReportService,
    private readonly pdfFileSaveService: PdfFileSaveService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  scrollIntoView(itemName: CalculationParametersCalculationTypeConfig['name']) {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'start',
    };
    document.querySelector(`#${itemName}`)?.scrollIntoView(scrollOptions);
  }

  async downloadPdfReport() {
    this.trackingService.logDownloadReport();

    const chartImage = this.emissionComponent?.chartImageWithoutSelection;

    const report = await this.reportService.generate(chartImage);
    const reportName = await this.reportService.generateFilename();

    this.pdfFileSaveService.saveAndOpenFile(report.document, reportName);
  }

  sendClickEvent(storeName: string) {
    this.trackingService.logAppStoreClick(storeName, 'result-report');
  }
}
