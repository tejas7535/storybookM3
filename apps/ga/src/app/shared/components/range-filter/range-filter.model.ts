export interface RangeFilter {
  name: string;
  min: number;
  max: number;
  label?: string;
  minSelected?: number;
  maxSelected?: number;
  unit?: string;
  disabled?: boolean;
}

export enum InputType {
  Min = 'min',
  Max = 'max',
}
