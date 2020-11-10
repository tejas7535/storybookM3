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
      coordinateSystem?: string;
      areaStyle?: any;
      smooth?: boolean;
      data: GraphSeriesData[] | [number, number][][];
    };
  };
}
