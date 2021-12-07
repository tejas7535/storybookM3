import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import {
  SeriesOption,
  TooltipComponentOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts';

import { ComparableLinkedTransaction } from '../../../../core/store/reducers/transactions/models/comparable-linked-transaction.model';
import { SalesIndication } from '../../../../core/store/reducers/transactions/models/sales-indication.enum';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { DataPoint } from '../models/data-point.model';
import { ToolTipItems } from '../models/tooltip-items.enum';
import { TOOLTIP_CONFIG } from './chart.config';
import { DataPointColor } from './data-point-color.enum';

@Injectable({
  providedIn: 'root',
})
export class ChartConfigService {
  INDEX_X_AXIS = 0;
  INDEX_Y_AXIS = 1;
  regressionData: number[][];
  tooltipLegendStyle = `display: inline-block; margin-right: 4px; border-radius: 10px; width: 10px; height: 10px;`;

  X_AXIS_CONFIG: XAXisComponentOption = {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    axisLabel: {
      show: true,
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
  };

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

    const gpi = `${PriceService.roundToTwoDecimals(
      dataPoint[this.INDEX_Y_AXIS]
    )}%`;

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
        return `${data.price} ${data.currency}`;
      case ToolTipItems.YEAR:
        return data.year;
      case ToolTipItems.QUANTITY:
        return data.value[this.INDEX_X_AXIS];
      case ToolTipItems.PROFIT_MARGIN:
        return `${data.value[this.INDEX_Y_AXIS]}%`;
      default:
        return ``;
    }
  };

  tooltipFormatter = (param: any): string => {
    const data: DataPoint = param.data;
    const listedItems = [
      ToolTipItems.QUANTITY,
      ToolTipItems.PROFIT_MARGIN,
      ToolTipItems.PRICE,
      ToolTipItems.YEAR,
    ];
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
    items += this.getRegressionForToolTipFormatter(data);

    return items;
  };

  getToolTipConfig = (): TooltipComponentOption => ({
    ...TOOLTIP_CONFIG,
    formatter: this.tooltipFormatter,
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
    regressionData: number[][]
  ): SeriesOption[] => {
    this.regressionData = regressionData;
    const series: SeriesOption[] = [];
    const type = 'scatter';

    const options = [
      SalesIndication.ORDER,
      SalesIndication.INVOICE,
      SalesIndication.LOST_QUOTE,
    ];

    // Add sales indiciation data
    options.forEach((option) => {
      const optionData = scatterData.filter(
        (e) => e.salesIndication === option
      );
      if (optionData.length > 0) {
        series.push({
          type,
          data: optionData,
          color: this.getDataPointStyle(option),
          name: this.getDataPointName(option),
        });
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

    return series;
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
}
