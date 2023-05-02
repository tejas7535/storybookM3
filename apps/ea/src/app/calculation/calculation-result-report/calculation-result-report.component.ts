import { CommonModule, formatNumber } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { map, Observable } from 'rxjs';

import {
  CalculationParametersFacade,
  CalculationResultFacade,
} from '@ea/core/store';
import { ProductSelectionFacade } from '@ea/core/store/facades/product-selection/product-selection.facade';
import { TranslocoService } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection';

const COLOR_PLATTE = ['#DDE86E', '#7DC882'];

@Component({
  templateUrl: './calculation-result-report.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PushModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    SharedTranslocoModule,
    NgxEchartsModule,
    CalculationTypesSelectionComponent,
  ],
})
export class CalculationResultReportComponent {
  public bearingDesignation$ = this.productSelectionFacade.bearingDesignation$;
  public co2Emissions$ =
    this.calculationResultFacade.calculationReportCO2Emission$;
  public selctedCalculationTypes$ =
    this.calculationParametersFacade.getCalculationTypes$;

  public getSelectedCalculations$ =
    this.calculationResultFacade.getSelectedCalculations$;

  public co2EmissionOptions$: Observable<EChartsOption> =
    this.co2Emissions$.pipe(
      map(
        (co2Emissions) =>
          ({
            color: COLOR_PLATTE,
            tooltip: {
              trigger: 'item',
              appendToBody: true,
              valueFormatter: (value) => this.formatValue(value as number),
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
                  fontSize: 32,
                  formatter: `${formatNumber(
                    (co2Emissions.co2_downstream || 0) +
                      (co2Emissions.co2_upstream || 0),
                    this.locale,
                    '1.2-2'
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
    private readonly calculationResultFacade: CalculationResultFacade,
    private readonly productSelectionFacade: ProductSelectionFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    public readonly dialogRef: MatDialogRef<CalculationResultReportComponent>,
    private readonly translocoService: TranslocoService,
    @Inject(LOCALE_ID)
    private readonly locale: string
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  private formatValue(value: number): string {
    return `${formatNumber(value, this.locale, '1.2-2')} kg`;
  }
}
