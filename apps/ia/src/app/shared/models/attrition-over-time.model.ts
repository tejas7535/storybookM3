export interface Event {
  date: Date;
  name: string;
}

export interface TerminatedEmployee {
  employeeName: string;
  orgUnit: string;
  position: string;
}

export interface AttritionSeries {
  [seriesName: string]: {
    employees: TerminatedEmployee[][];
    attrition: number[];
  };
}

export interface AttritionOverTime {
  events: Event[];
  data: AttritionSeries;
}
