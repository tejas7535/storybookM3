import { DialogModule, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { CO2EmissionResult } from '@ea/core/store/selectors/calculation-result/calculation-result-report.selector';
import { CHARTS_COLORS } from '@ea/shared/constants/charts-colors';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { TranslocoService } from '@jsverse/transloco';
import { ECharts, EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationDisclaimerComponent } from '../calculation-disclaimer/calculation-disclaimer.component';
import { CalculationDownstreamEmissionComponent } from '../calculation-downstream-emission/calculation-downstream-emission.component';
import { CalculationResultReportComponent } from '../calculation-result-report/calculation-result-report.component';
import { ReportCo2EmissionsValuesComponent } from '../report-co2-emissions-values/report-co2-emissions-values.component';

interface Co2ResultItem {
  value: number;
  unit: string;
  short: string;
  title: string;
  titleTooltip: string;
}

interface SelectionChangeParams {
  type: string;
  fromAction: 'select' | 'unselect' | 'toggleSelect';
  fromActionPayload: {
    dataIndexInside?: number;
    dataIndex?: number;
  };
}

interface ChartDataItem {
  value: number;
  name: string;
  itemStyle?: {
    opacity: number;
  };
}

@Component({
  selector: 'ea-calculation-result-report-emission',
  templateUrl: './calculation-result-report-emission.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsModule,
    MatIconModule,
    SharedTranslocoModule,
    MatDividerModule,
    MatButtonModule,
    ReportCo2EmissionsValuesComponent,
    DialogModule,
    CalculationDownstreamEmissionComponent,
    MeaningfulRoundPipe,
  ],
})
export class CalculationResultReportEmissionComponent {
  @Input()
  public bearingDesignation: string;

  @Input()
  public downstreamError?: string;

  public readonly chartColors = CHARTS_COLORS;
  public co2ResultItem: Co2ResultItem;
  public co2EmissionOptions: EChartsOption;
  public _co2Emission: CO2EmissionResult;
  public selectedIndex: number = undefined;
  private chartInstance: ECharts;
  private _chartImageWithoutSelection: string;
  private readonly selectFormAction = 'select';
  private readonly lowEmphasisOpacity = 0.3;
  private readonly highEmphasisOpacity = 1;
  private chartData: ChartDataItem[];

  constructor(
    private readonly translocoService: TranslocoService,
    public readonly dialogRef: DialogRef<CalculationResultReportComponent>,
    private readonly dialog: MatDialog,
    private readonly meaningfulRoundPipe: MeaningfulRoundPipe
  ) {}

  get chartImageWithoutSelection(): string {
    return this._chartImageWithoutSelection;
  }

  get co2Emission(): CO2EmissionResult {
    return this._co2Emission;
  }

  @Input()
  set co2Emission(value: CO2EmissionResult) {
    this._co2Emission = value;
    this.co2ResultItem = this.getCo2ResultItem(value);
    this.chartData = this.getChartData(value);

    this.setChartOptions(value);
  }

  onChartInit(e: ECharts) {
    this.chartInstance = e;

    this.chartInstance.on(
      'selectchanged',
      (params: Partial<SelectionChangeParams>) => {
        const { fromActionPayload, fromAction } = params;

        const index =
          fromActionPayload.dataIndexInside ?? fromActionPayload.dataIndex;

        if (fromAction === this.selectFormAction) {
          this.updateChartDataOpacity(index, 1, this.lowEmphasisOpacity);
          this.selectedIndex = index;
        } else {
          const wrongIndex = -1;
          this.updateChartDataOpacity(wrongIndex, 1, this.highEmphasisOpacity);
          this.selectedIndex = undefined;
        }

        this.updateOptionsData();
      }
    );
  }

  onChartRendered() {
    this.setChartImage();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showCalculationDisclaimerDialog() {
    this.dialog.open(CalculationDisclaimerComponent, {
      hasBackdrop: true,
      autoFocus: true,
      maxWidth: '750px',
      panelClass: 'legal-disclaimer-dialog',
    });
  }

  showDownstreamCalculationDisclaimerDialog() {
    this.dialog.open(CalculationDisclaimerComponent, {
      hasBackdrop: true,
      autoFocus: true,
      maxWidth: '750px',
      panelClass: 'legal-disclaimer-dialog',
      data: {
        isDownstreamDisclaimer: true,
      },
    });
  }

  isSelected(index: number): boolean {
    return this.selectedIndex === index;
  }

  selectItem(index: number) {
    this.dispatchAction('select', index);
  }

  deselectAllItems() {
    this.dispatchAction('unselect', this.selectedIndex);
  }

  handleLoadcaseSelection(index: number): void {
    if (index === 0) {
      this.deselectAllItems();
    } else {
      this.selectItem(index);
    }
  }

  private setChartImage(): void {
    // set only on the first render of chart to have initial state of image
    setTimeout(() => {
      if (!this._chartImageWithoutSelection) {
        const chartImage = this.chartInstance.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff',
        });

        this._chartImageWithoutSelection = chartImage;
      }
    }, 500);
  }

  private updateChartDataOpacity(
    selectedIndex: number,
    opacity: number,
    defaultOpacity: number
  ) {
    this.chartData.forEach((item, i) => {
      item.itemStyle = {
        opacity: i === selectedIndex ? opacity : defaultOpacity,
      };
    });
  }

  private dispatchAction(type: 'unselect' | 'select', index: number): void {
    this.chartInstance.dispatchAction({
      type,
      seriesIndex: 0,
      dataIndex: index,
    });
  }

  private getChartData(result: CO2EmissionResult): ChartDataItem[] {
    const { co2_upstream, co2_downstream } = result;
    const loadCasesData = co2_downstream.loadcases.map((lc) => ({
      value: lc.emission,
      name:
        co2_downstream.loadcases.length === 1
          ? this.translate('chartDownstream')
          : lc.id,
    }));

    return [
      {
        value: co2_upstream,
        name: this.translate('chartUpstream'),
      },
      ...loadCasesData,
    ];
  }

  private setChartOptions(result: CO2EmissionResult): void {
    const { co2_upstream, co2_downstream } = result;

    const valueToFormat = (co2_downstream.emission || 0) + (co2_upstream || 0);
    const formattedValue = this.formatValue(valueToFormat);

    const fontSize = formattedValue.length > 8 ? 24 : 32;

    this.co2EmissionOptions = {
      color: CHARTS_COLORS,
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        valueFormatter: (value) => this.formatValue(value as number),
        show: false,
      },
      series: [
        {
          selectedMode: 'single',
          name: this.translate('chartDescription'),
          type: 'pie',
          radius: ['70%', '90%'],
          avoidLabelOverlap: false,
          emphasis: {
            focus: 'self',
            itemStyle: {
              borderColor: '#fff',

              borderWidth: 2,
              borderRadius: 4,
            },
          },
          select: {
            focus: 'self',
          },
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
            opacity: 1,
          },

          label: {
            show: true,
            position: 'center',
            fontSize,
            formatter: formattedValue,
          },
          labelLine: {
            show: false,
          },
          data: this.chartData,
        },
      ],
    } as EChartsOption;
  }

  private getCo2ResultItem(result: CO2EmissionResult): Co2ResultItem {
    const unit = this.translate('unit');

    const productionTooltip = this.translocoService.translate(
      'calculationResult.productionTooltip'
    );

    return {
      value: result.co2_upstream,
      unit: 'kg',
      short: unit,
      title: 'upstreamTitle',
      titleTooltip: productionTooltip,
    };
  }

  private updateOptionsData(): void {
    this.chartInstance.setOption({
      ...this.co2EmissionOptions,
      series: [
        {
          data: this.chartData,
        },
      ],
    });
  }

  private formatValue(value: number): string {
    return `${this.meaningfulRoundPipe.transform(value)} kg`;
  }

  private translate(key: string): string {
    return this.translocoService.translate(
      `calculationResultReport.co2Emissions.${key}`
    );
  }
}
