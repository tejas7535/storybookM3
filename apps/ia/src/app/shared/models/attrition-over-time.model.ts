import { Employee } from './employee';

export interface Event {
  date: string;
  name: string;
}

export interface AttritionSeries {
  [seriesName: string]: {
    employees: Employee[][];
    attrition: number[];
  };
}

export interface AttritionOverTime {
  events: Event[];
  data: AttritionSeries;
}
