interface GraphSeriesData {
  value: [string, number] | number;
  name?: string;
}

export interface GraphData {
  legend?: {
    data: string[];
  };
  series: {
    [index: number]: {
      name: string;
      type: string;
      symbol?: string;
      coordinateSystem?: string;
      areaStyle?: any;
      smooth?: boolean;
      itemStyle?: any;
      data:
        | GraphSeriesData[]
        | [number, number][][]
        | [
            {
              value: number[];
            }
          ];
    };
  };
}
