import { GreaseResult } from './grease-result.model';

export type GreaseReportSubordinateIdentifier =
  | 'text'
  | 'textPairList'
  | 'textBlock'
  | 'block'
  | 'table'
  | 'legalNote'
  | 'variableBlock'
  | 'variableLine'
  | 'greaseResult';

export enum GreaseReportSubordinateTitle {
  STRING_OUTP_INPUT = 'STRING_OUTP_INPUT',
  STRING_OUTP_RESULTS = 'STRING_OUTP_RESULTS',
  STRING_OUTP_RESULTS_FOR_GREASE_SELECTION = 'STRING_OUTP_RESULTS_FOR_GREASE_SELECTION',
  STRING_OUTP_RESULTS_FOR_GREASE_SERVICE_STRING_OUTP_GREASE_QUANTITY_IN_CCM = 'STRING_OUTP_RESULTS_FOR_GREASE_SERVICE_STRING_OUTP_GREASE_QUANTITY_IN_CCM',
  STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES = 'STRING_OUTP_OVERVIEW_OF_CALCULATION_DATA_FOR_GREASES',
}

export enum GreaseReportSubordinateHint {
  ERRORS = 'errors',
  WARNINGS = 'warnings',
  NOTES = 'notes',
}

export enum SubordinateDataItemField {
  GREASE_GRADE = 'Grease grade',
  BASEOIL = 'BaseOil',
  NLGI = 'NLGI',
  THICKENER = 'Thickener',
  QVIN = 'Qvin',
  QVRE_MAN_MIN = 'Qvre_man_min',
  QVRE_MAN_MAX = 'Qvre_man_max',
  QVRE_AUT_MIN = 'Qvre_aut_min',
  QVRE_AUT_MAX = 'Qvre_aut_max',
  TFR_MIN = 'tfR_min',
  TFR_MAX = 'tfR_max',
  NY40 = 'ny40',
  T_LIM_LOW = 'T_lim_low',
  T_LIM_UP = 'T_lim_up',
  TFG_MIN = 'tfG_min',
  TFG_MAX = 'tfG_max',
  ADD_REQ = 'add_req',
  ADD_W = 'add_w',
  RHO = 'rho',
  F_LOW = 'f_low',
  VIP = 'vib',
  SEAL = 'seal',
  NSF_H1 = 'NSF-H1',
  KAPPA = 'kappa',
}

export interface GreaseReportSubordinateDataItem {
  value?: string | null | number;
  unit?: string;
  field?: `${SubordinateDataItemField}`;
}

export interface GreaseReportSubordinateDescription {
  identifier: string;
  title: string;
  entries: string[][];
}

export interface GreaseReportSubordinateData {
  originalFields?: string[];
  fields: string[];
  unitFields: (null | undefined | { unit: string })[];
  items: GreaseReportSubordinateDataItem[][];
}

export interface GreaseReportSubordinate {
  identifier: GreaseReportSubordinateIdentifier;
  title?: string;
  entries?: string[][];
  text?: string[];
  designation?: string;
  value?: string;
  data?: GreaseReportSubordinateData;
  abbreviation?: string;
  titleID?: `${GreaseReportSubordinateTitle}`;
  legal?: string;
  unit?: string;
  description?: GreaseReportSubordinateDescription;
  subordinates?: GreaseReportSubordinate[];
  defaultOpen?: boolean;
  content?: any;
  clickHandler?: any;
  greaseResult?: GreaseResult;
}
