export interface Axis {
  name: string;
  nameLocation: 'start' | 'middle' | 'end';
  showLabel: boolean;
  format: string;
  showGrid: boolean;
  showMinorGrid: boolean;
  type: any;
}
