import { translate } from '@ngneat/transloco';

import { ChartLegendItem } from '../../../shared/charts/models/chart-legend-item.model';
import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { Color } from '../../../shared/models/color.enum';
import { ReasonForLeavingRank } from '../../models/reason-for-leaving-rank.model';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import { getPercentageValue } from './reasons-and-counter-measures.selector';

export function mapReasonsToTableData(data: ReasonForLeavingStats[]) {
  const totalLeavers = data
    ?.map((reason) => reason.leavers)
    .reduce((valuePrev, valueCurrent) => valuePrev + valueCurrent, 0);

  const rankList = data?.map((d) => d.leavers).sort((a, b) => b - a);

  return data?.map(
    (reason) =>
      new ReasonForLeavingRank(
        rankList.indexOf(reason.leavers) + 1,
        reason.detailedReason,
        getPercentageValue(reason.leavers, totalLeavers),
        reason.leavers
      )
  );
}

export function getTop5ReasonsForChart(
  data: ReasonForLeavingStats[]
): DoughnutChartData[] {
  if (data.length === 0) {
    return [];
  }
  const dataOrderedDescending = [...data].sort((a, b) => b.leavers - a.leavers);
  const top5Reasons = dataOrderedDescending
    .slice(0, 5)
    .map((reason) => ({ value: reason.leavers, name: reason.detailedReason }));

  if (dataOrderedDescending.length > 5) {
    const otherCount = dataOrderedDescending
      .slice(5)
      .map((reason) => reason.leavers)
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((valuePrev, valueCurrent) => valuePrev + valueCurrent, 0);

    top5Reasons.push({
      value: otherCount,
      name: translate('reasonsAndCounterMeasures.topFiveReasons.chart.others'),
    });
  }

  return top5Reasons;
}

export function getTooltipFormatter(): string {
  const leavers = translate(
    'reasonsAndCounterMeasures.topFiveReasons.chart.tooltip.leavers'
  );

  return `{b}<br><b>{c}</b> ${leavers} - <b>{d}%</b>`;
}

export const COLOR_PALETTE = [
  Color.COLORFUL_CHART_11,
  Color.COLORFUL_CHART_10,
  Color.COLORFUL_CHART_9,
  Color.COLORFUL_CHART_8,
  Color.COLORFUL_CHART_7,
  Color.COLORFUL_CHART_6,
  Color.COLORFUL_CHART_5,
  Color.COLORFUL_CHART_4,
  Color.COLORFUL_CHART_3,
  Color.COLORFUL_CHART_2,
  Color.COLORFUL_CHART_1,
  Color.COLORFUL_CHART_0,
];

export function getColorsForChart(
  defaultChartData: DoughnutChartData[],
  compareChartData?: DoughnutChartData[]
): Color[] {
  if (!compareChartData) {
    return COLOR_PALETTE;
  }

  const colors = Array.from<Color>({ length: COLOR_PALETTE.length });
  compareChartData.forEach((stats, idxCompare) => {
    const idx = defaultChartData.findIndex(
      (defElem) => defElem.name !== undefined && defElem.name === stats.name
    );

    if (idx !== -1) {
      const targetColor = COLOR_PALETTE[idx];
      colors[idxCompare] = targetColor;
    }
  });

  // remove first n colors from color palette to get available colors for compareChartData
  const remainingColors = [...COLOR_PALETTE];
  remainingColors.splice(0, compareChartData.length);

  // fill undefined entries with available colors
  const colorPalette = colors
    .map((color: Color) =>
      color !== undefined ? color : remainingColors.shift()
    )
    .filter((color: Color) => color !== undefined);

  return colorPalette;
}

export function mapDataToLegendItems(
  data: DoughnutChartData[],
  colors: string[]
): ChartLegendItem[] {
  const items: ChartLegendItem[] = [];

  for (const [index, dataItem] of data.entries()) {
    items.push(
      new ChartLegendItem(dataItem.name, colors[index], undefined, true)
    );
  }

  return items;
}

export function getUniqueChartLegendItemsFromComparedLegend(
  legend: ChartLegendItem[],
  comparedLegend: ChartLegendItem[]
): ChartLegendItem[] {
  return comparedLegend.filter(
    (comparedItem) =>
      !legend.some((legendItem) => legendItem.name === comparedItem.name)
  );
}
