export interface Report {
  rel: string;
  href: string;
}

export interface Result {
  pdfReportUrl: string;
  htmlReportUrl: string;
  jsonReportUrl?: string;
}

export interface RawValueContent {
  name: string;
  value: string | number;
}

// todo remove once report result is fixed
export interface RawValue {
  initialValue?: string | number;
  name: string;
  value: any;
  visualizationValue?: any;
  dimension1?: any;
  dimension2?: any;
  dimension3?: any;
}
