import { EChartOption } from 'echarts';

export interface Axis {
  name: string;
  nameLocation: 'center' | 'start' | 'middle' | 'end';
  showLabel: boolean;
  format: string;
  showGrid: boolean;
  showMinorGrid: boolean;
  type: EChartOption.BasicComponents.CartesianAxis.Type;
}
