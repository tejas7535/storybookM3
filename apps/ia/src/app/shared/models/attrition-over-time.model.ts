export interface AttritionSeries {
  [seriesName: string]: {
    attrition: number[];
  };
}

export interface AttritionOverTime {
  data: AttritionSeries;
  responseModified: boolean;
  warningMessage: string;
}
