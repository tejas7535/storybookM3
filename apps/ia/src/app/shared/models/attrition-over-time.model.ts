import { Employee } from './employee';

export interface AttritionSeries {
  [seriesName: string]: {
    employees: Employee[][];
    attrition: number[];
  };
}

export interface AttritionOverTime {
  data: AttritionSeries;
}
