import { Injectable } from '@angular/core';

import {
  ComparableLinkedTransaction,
  SalesIndication,
} from '@gq/core/store/reducers/models';
import { translate } from '@ngneat/transloco';
import {
  LegendComponentOption,
  SeriesOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';

import { Customer } from '../../../../shared/models/customer';
import { HelperService } from '../../../../shared/services/helper/helper.service';
import { PriceService } from '../../../../shared/services/price/price.service';
import { DataPoint } from '../models/data-point.model';
import { ToolTipItems } from '../models/tooltip-items.enum';
import { LEGEND, TOOLTIP_CONFIG } from './chart.config';
import { DataPointColor } from './data-point-color.enum';

@Injectable({
  providedIn: 'root',
})
export class ChartConfigService {
  INDEX_X_AXIS = 0;
  INDEX_Y_AXIS = 1;
  regressionData: number[][];
  tooltipLegendStyle = `display: inline-block; margin-right: 4px; width: 10px; height: 10px;`;

  X_AXIS_CONFIG: XAXisComponentOption = {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    axisLabel: {
      show: true,
      formatter: (value: number) =>
        this.helperService.transformNumber(value, false),
    },
    name: translate(`transactionView.graph.x-axis`),
    nameLocation: 'middle',
    nameGap: 40,
  };

  Y_AXIS_CONFIG: YAXisComponentOption = {
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    name: translate(`transactionView.graph.y-axis`),
    nameGap: 20,
    max: 100,
    axisLabel: {
      formatter: (value: number) =>
        this.helperService.transformNumber(value, false),
    },
  };

  constructor(private readonly helperService: HelperService) {}

  getLineForToolTipFormatter = (
    color: string,
    translateKey: string,
    data: number | string
  ): string => {
    const item = `
    <span style="float:left; width: 100px ">
    <span
    style ="${this.tooltipLegendStyle}
    background-color: ${color};"
    ></span>
    <span style="font-size: 12px; color: #646464; font-family: 'Roboto'">${translate(
      `transactionView.graph.tooltip.${translateKey}`
    )}: </span>
    </span>
    <span style="font-size: 12px; font-weight: bold; font-family: 'Roboto'; color: #000000">${data}</span><br/>`;

    return item;
  };

  getRegressionForToolTipFormatter = (data: DataPoint): string => {
    const dataPoint = this.regressionData.find(
      (d) => d[0] === data.value[this.INDEX_X_AXIS]
    );

    const gpi = `${this.helperService.transformPercentage(
      dataPoint[this.INDEX_Y_AXIS]
    )}`;

    let items = `<hr style="margin-top: 5px; margin-bottom:5px; opacity: 0.2">`;

    items += this.getLineForToolTipFormatter(
      DataPointColor.REGRESSION,
      'regression',
      gpi
    );

    return items;
  };

  getValueForToolTipItem = (
    item: ToolTipItems,
    data: DataPoint
  ): string | number => {
    switch (item) {
      case ToolTipItems.PRICE:
        return this.helperService.transformNumberCurrency(
          data.price.toString(),
          data.currency
        );
      case ToolTipItems.YEAR:
        return data.year;
      case ToolTipItems.QUANTITY:
        return this.helperService.transformNumber(
          data.value[this.INDEX_X_AXIS],
          false
        );
      case ToolTipItems.PROFIT_MARGIN:
        return this.helperService.transformPercentage(
          data.value[this.INDEX_Y_AXIS]
        );
      default:
        return ``;
    }
  };

  tooltipFormatter = (param: any, showGpi: boolean): string => {
    const data: DataPoint = param.data;

    const listedItems = [
      ToolTipItems.QUANTITY,
      ToolTipItems.PRICE,
      ToolTipItems.YEAR,
    ];

    if (showGpi) {
      listedItems.splice(1, 0, ToolTipItems.PROFIT_MARGIN);
    }

    let items = `<span style="font-family: 'Roboto';color: rgba(0,0,0,0.38); font-weight:bold">${data.customerName}</span><br>`;

    // tooltip data for scatter
    listedItems.forEach((item) => {
      const value = this.getValueForToolTipItem(item, data);
      items += this.getLineForToolTipFormatter(
        this.getDataPointStyle(data.salesIndication),
        item,
        value
      );
    });

    // tooltip data for regression
    if (showGpi) {
      items += this.getRegressionForToolTipFormatter(data);
    }

    return items;
  };

  getToolTipConfig = (showGpi: boolean): TooltipComponentOption => ({
    ...TOOLTIP_CONFIG,
    formatter: (param) => this.tooltipFormatter(param, showGpi),
  });

  calculateAxisMax = (datapoints: DataPoint[], index: number): number => {
    // Get current max axis point
    const maxPoint = Math.max(...datapoints.map((o) => o.value[index]));
    // Get current steps (there are always six lines)
    const step = Math.floor(maxPoint / 6);
    // Add an additional step
    const max = Math.floor(maxPoint + step);

    return max;
  };

  getXAxisConfig = (datapoints: DataPoint[]): XAXisComponentOption => {
    const max = this.calculateAxisMax(datapoints, this.INDEX_X_AXIS);

    return { ...this.X_AXIS_CONFIG, max };
  };

  getSeriesConfig = (
    scatterData: DataPoint[],
    regressionData: number[][],
    customer: Customer
  ): { series: SeriesOption[]; options: SalesIndication[] } => {
    this.regressionData = regressionData;
    const series: SeriesOption[] = [];
    const type = 'scatter';

    const customerPoints = scatterData.filter(
      (dp) => dp.customerId === customer.identifier.customerId
    );
    customerPoints.forEach((dp) =>
      series.push({
        type,
        data: [dp],
        color: this.getDataPointStyle(dp.salesIndication),
        itemStyle: { borderColor: DataPointColor.SAME_CUSTOMER_BORDER },
        name: customer.name,
      })
    );

    const options = [
      SalesIndication.ORDER,
      SalesIndication.INVOICE,
      SalesIndication.LOST_QUOTE,
    ];
    const foundOptions: SalesIndication[] = [];
    // Add sales indiciation data
    options.forEach((option) => {
      const optionData = scatterData.filter(
        (e) =>
          e.salesIndication === option &&
          e.customerId !== customer.identifier.customerId
      );
      if (optionData.length > 0) {
        series.push({
          type,
          data: optionData,
          color: this.getDataPointStyle(option),
          name: this.getDataPointName(option),
        });
        foundOptions.push(option);
      }
    });

    // Add regression line
    series.push({
      type: 'line',
      data: regressionData,
      name: translate(`transactionView.graph.regression`),
      color: DataPointColor.REGRESSION,
      symbol: 'none',
    });

    return { series, options: foundOptions };
  };

  buildDataPoints = (
    transactions: ComparableLinkedTransaction[],
    currency: string
  ): DataPoint[] => {
    const dataPoints: DataPoint[] = [];

    transactions.forEach((transaction) => {
      dataPoints.push({
        currency,
        value: [
          transaction.quantity,
          PriceService.roundToTwoDecimals(transaction.profitMargin),
        ],
        salesIndication: transaction.salesIndication,
        year: transaction.year,
        price: PriceService.roundToTwoDecimals(transaction.price),
        customerName: transaction.customerName,
        customerId: transaction.customerId,
      });
    });

    return dataPoints;
  };

  getDataPointStyle = (salesIndication: SalesIndication): DataPointColor => {
    if (salesIndication === SalesIndication.INVOICE) {
      return DataPointColor.INVOICE;
    }
    if (salesIndication === SalesIndication.LOST_QUOTE) {
      return DataPointColor.LOST_QUOTE;
    }
    if (salesIndication === SalesIndication.ORDER) {
      return DataPointColor.ORDER;
    }

    // default
    return undefined;
  };

  getDataPointName = (salesIndication: SalesIndication): string => {
    let translateString = `transactionView.graph.salesIndication.`;
    if (salesIndication === SalesIndication.INVOICE) {
      translateString += 'invoice';
    }
    if (salesIndication === SalesIndication.ORDER) {
      translateString += `order`;
    }
    if (salesIndication === SalesIndication.LOST_QUOTE) {
      translateString += `lostQuote`;
    }

    return translate(translateString);
  };

  getLegend = (
    customer: Customer,
    series: SeriesOption[],
    salesIndications: SalesIndication[]
  ): LegendComponentOption => {
    const data = [];

    // Add customer legend
    if (series.some((e) => e.name === customer.name)) {
      data.push({
        name: customer.name,
        icon: 'circle',
        itemStyle: {
          color: DataPointColor.SAME_CUSTOMER,
          borderColor: DataPointColor.SAME_CUSTOMER_BORDER,
          borderWidth: 1,
        },
      });
    }

    // Add sales indications legends
    salesIndications.forEach((indication) =>
      data.push({
        name: this.getDataPointName(indication),
        icon: 'circle',
      })
    );

    // Add regression line legend
    data.push({
      name: translate(`transactionView.graph.regression`),
      icon: 'circle',
    });

    return {
      ...LEGEND,
      data,
    };
  };
}
