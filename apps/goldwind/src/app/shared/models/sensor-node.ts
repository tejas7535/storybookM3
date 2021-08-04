import { Control } from './controls';
export interface SensorNode {
  name?: string;
  children?: Control[];
  formControl?: any;
  indeterminate?: boolean;
}
