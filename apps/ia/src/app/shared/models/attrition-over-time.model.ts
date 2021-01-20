export interface Event {
  date: Date;
  name: string;
}

export interface TerminatedEmployee {
  employeeName: string;
  orgUnit: string;
  position: string;
}

export interface AttritionOverTime {
  events: Event[];
  data: {
    [seriesName: string]: {
      employees: TerminatedEmployee[][];
      attrition: number[];
    };
  };
}
