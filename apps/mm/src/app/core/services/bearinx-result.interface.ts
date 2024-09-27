export interface BearinxOnlineResult {
  identifier: string;
  title: string;
  titleID: string;
  programName: string;
  programNameID: string;
  isBeta: boolean;
  method: string;
  methodID: string;
  companyInformation: unknown;
  timeStamp: string;
  programVersion: string;
  transactionFileName?: string;
  subordinates?: BearinxOnlineResultSubordinate[];
}

export interface BearinxOnlineResultSubordinate {
  identifier: string;
  designation?: string;
  title?: string;
  titleID?: string;
  value?: string;
  abbreviation?: string;
  unit?: string;
  entries?: [string, string][];
  legal?: string;
  subordinates?: BearinxOnlineResultSubordinate[];
  text?: string[];
  data?: {
    fields: string[];
    unitFields?: { unit: string }[];
    items: { field: string; value: string; unit?: string }[][];
  };
  description?: {
    identifier: string;
    title: string;
    entries: [string, string][];
  };
}
