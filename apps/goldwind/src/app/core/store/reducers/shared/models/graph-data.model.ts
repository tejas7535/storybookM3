export interface GraphData {
  legend: {
    data: string[];
  };
  series: {
    [index: number]: {
      name: string;
      type: string;
      data: {
        [index: number]: {
          value: [string, number];
        };
      };
    };
  };
}
