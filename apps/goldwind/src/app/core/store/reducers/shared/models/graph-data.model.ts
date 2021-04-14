interface GraphSeriesData {
  value: [string, number] | number;
  name?: string;
}

export interface GraphData {
  tooltip?: {
    formatter: any;
  };
  legend?: {
    data: string[];
  };
  series: {
    [index: number]: {
      name?: string;
      type: string;
      symbol?: string;
      coordinateSystem?: string;
      areaStyle?: any;
      smooth?: boolean;
      itemStyle?: any;
      data:
        | GraphSeriesData[]
        | [number, number][][]
        | [number, number][]
        | [
            {
              name?: string;
              value: number[];
            }
          ];
    };
  };
}
