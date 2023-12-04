export interface ResultReportLargeItem {
  /** Value of this item */
  value?: string | number;
  /** Value of this item per loadcase*/
  loadcaseValues?: { value?: string | number; loadcaseName: string }[];
  /** Unit of the value */
  unit?: string;
  /** Scientific name, displayed in tag */
  short?: string;
  /** Transloco key */
  title: string;
  /** Optional tooltip */
  titleTooltip?: string;
  /** Optional warning for this item */
  warning?: string;
}
