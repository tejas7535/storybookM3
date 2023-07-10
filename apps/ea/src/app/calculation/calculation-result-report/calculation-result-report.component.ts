import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  LOCALE_ID,
  ViewChild,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MatLegacyDialog as Dialog,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { map, Observable } from 'rxjs';

import {
  CalculationParametersFacade,
  CalculationResultFacade,
} from '@ea/core/store';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import { CalculationParametersCalculationTypeConfig } from '@ea/core/store/models';
import { ExpansionPanelComponent } from '@ea/expansion-panel/expansion-panel.component';
import { InfoBannerComponent } from '@ea/shared/info-banner/info-banner.component';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { TagComponent } from '@ea/shared/tag/tag.component';
import { TranslocoService } from '@ngneat/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationDisclaimerComponent } from '../calculation-disclaimer/calculation-disclaimer.component';
import { CalculationResultMessageComponent } from '../calculation-result-information/calculation-result-message.component';
import { CalculationResultReportInputComponent } from '../calculation-result-report-input';
import { CalculationResultReportLargeItemsComponent } from '../calculation-result-report-large-items/calculation-result-report-large-items.component';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection';

const COLOR_PLATTE = ['#DDE86E', '#7DC882'];

@Component({
  templateUrl: './calculation-result-report.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PushPipe,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SharedTranslocoModule,
    NgxEchartsModule,
    TagComponent,
    LetDirective,
    MeaningfulRoundPipe,
    CalculationTypesSelectionComponent,
    CalculationResultReportInputComponent,
    CalculationResultMessageComponent,
    InfoBannerComponent,
    ExpansionPanelComponent,
    CalculationResultReportLargeItemsComponent,
  ],
})
export class CalculationResultReportComponent {
  @ViewChild('emissionPanel')
  emissionPanel: ElementRef<MatExpansionPanelHeader>;

  public bearingDesignation$ = this.productSelectionFacade.bearingDesignation$;

  public selctedCalculationTypes$ =
    this.calculationParametersFacade.getCalculationTypes$;

  public calcualtionModuleInfo$ =
    this.productSelectionFacade.calcualtionModuleInfo$;

  public isDownstreamAvailable$ =
    this.productSelectionFacade.calcualtionModuleInfo$.pipe(
      map((res) => res?.frictionCalculation)
    );

  public co2EmissionOptions$: Observable<EChartsOption> =
    this.calculationResultFacade.calculationReportCO2Emission$.pipe(
      map(
        (co2Emissions) =>
          ({
            color: COLOR_PLATTE,
            tooltip: {
              trigger: 'item',
              appendToBody: true,
              valueFormatter: (value) =>
                new MeaningfulRoundPipe(this.locale).transform(value as number),
            },
            series: [
              {
                name: this.translocoService.translate(
                  'calculationResultReport.co2Emissions.chartTitle'
                ),
                type: 'pie',
                radius: ['60%', '90%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 4,
                  borderColor: '#fff',
                  borderWidth: 2,
                },
                emphasis: {
                  itemStyle: {
                    color: 'inherit',
                  },
                },
                label: {
                  show: true,
                  position: 'center',
                  fontSize: 24,
                  formatter: `${new MeaningfulRoundPipe(this.locale).transform(
                    (co2Emissions.co2_downstream || 0) +
                      (co2Emissions.co2_upstream || 0)
                  )} kg`,
                },
                labelLine: {
                  show: false,
                },

                data: [
                  {
                    value: co2Emissions.co2_upstream,
                    name: this.translocoService.translate(
                      'calculationResultReport.co2Emissions.chartUpstream'
                    ),
                  },
                  {
                    value: co2Emissions.co2_downstream,
                    name: this.translocoService.translate(
                      'calculationResultReport.co2Emissions.chartDownstream'
                    ),
                  },
                ],
              },
            ],
          } as EChartsOption)
      )
    );

  constructor(
    public readonly calculationResultFacade: CalculationResultFacade,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    public readonly dialogRef: MatDialogRef<CalculationResultReportComponent>,
    private readonly translocoService: TranslocoService,
    @Inject(LOCALE_ID)
    private readonly locale: string,
    private readonly dialog: Dialog
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
