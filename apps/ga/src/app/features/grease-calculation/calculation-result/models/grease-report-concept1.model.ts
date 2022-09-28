import {
  GreaseReportSubordinate,
  GreaseReportSubordinateTitle,
} from './grease-report-subordinate.model';

export const CONCEPT1 = 'concept1';

export enum SUITABILITY {
  'YES' = 'LB_YES',
  'NO' = 'LB_NO',
  'CONDITION' = 'LB_CONDITION',
  'UNKNOWN' = 'LB_UNKNOWN',
}

export enum SUITABILITY_LABEL {
  'SUITED' = 'SUITED',
  'NOT_SUITED' = 'NOT_SUITED',
  'UNSUITED' = 'UNSUITED',
  'CONDITIONAL' = 'CONDITIONAL',
  'UNKNOWN' = 'UNKNOWN',
}

export type GreaseReportConcept1Subordinate = Omit<
  GreaseReportSubordinate,
  'titleID'
> & {
  titleID: `${GreaseReportSubordinateTitle}` | `${SUITABILITY}`;
};
