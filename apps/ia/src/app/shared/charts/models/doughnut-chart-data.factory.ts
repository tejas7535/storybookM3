import { DetailedReasonStyle, ReasonStyle } from '.';
import { DoughnutChartData } from './doughnut-chart-data.model';

export const DoughnutChartDataFactory = {
  createWithReasonId(
    value: number,
    name: string,
    reasonId: number,
    percent?: number
  ): DoughnutChartData {
    const color = ReasonStyle.get(reasonId);
    const data = new DoughnutChartData(value, name, undefined, color);
    if (percent !== undefined) {
      data.percent = percent;
    }

    return data;
  },

  createWithDetailedReasonId(
    value: number,
    name: string,
    detailedReasonId: number,
    percent?: number
  ): DoughnutChartData {
    const color = DetailedReasonStyle.get(detailedReasonId);
    const data = new DoughnutChartData(value, name, undefined, color);
    if (percent !== undefined) {
      data.percent = percent;
    }

    return data;
  },

  createFromReason(reasonData: {
    value: number;
    name: string;
    reasonId: number;
    percent?: number;
  }): DoughnutChartData {
    return this.createWithReasonId(
      reasonData.value,
      reasonData.name,
      reasonData.reasonId,
      reasonData.percent
    );
  },

  createFromDetailedReason(detailedReasonData: {
    value: number;
    name: string;
    detailedReasonId: number;
    percent?: number;
  }): DoughnutChartData {
    return this.createWithDetailedReasonId(
      detailedReasonData.value,
      detailedReasonData.name,
      detailedReasonData.detailedReasonId,
      detailedReasonData.percent
    );
  },
};
