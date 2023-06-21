export type BearinxOnlineResult = BearinxOnlineResultSubordinate & {
  programName: string;
  programNameID: string;
  isBeta: boolean;
  method: string;
  methodID: string;

  companyInformation: unknown;
  timeStamp: string;
  programVersion: string;
  transactionFileName: string;
};

export interface BearinxOnlineResultSubordinate {
  identifier: string;
  designation?: string;
  title?: string;
  titleID?: string;
  value?: string;
  abbreviation?: string;
  unit?: string;
  entries?: [][];
  subordinates: BearinxOnlineResultSubordinate[];
  data?: {
    fields: string[];
    unitFields: { unit: string }[];
    items: { field: string; value: string; unit?: string }[][];
  };
}
