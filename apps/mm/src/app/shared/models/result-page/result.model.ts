import { ObjectProperty } from '@caeonline/dynamic-forms';

export interface Report {
  rel: string;
  href: string;
}

export interface Result {
  pdfReportUrl: string;
  htmlReportUrl: string;
  jsonReportUrl: string;
}

export interface RawValueContent {
  name: string;
  value: string | number;
}

export interface RawValue extends ObjectProperty {
  initialValue?: string | number;
}
