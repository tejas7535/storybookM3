import { IgnoreFlag } from '../../sales-summary/sales-row-details/enums/ignore-flag.enum';

export enum SalesCategory {
  A = 'A',
  B = 'B',
}

export class SalesSummary {
  public constructor(
    public combinedKey: string,
    public timeoutWarning: boolean,
    public category: string,
    public standardFtype: string,
    public businessUnitKey: string,
    public businessUnitName: string,
    public sectorKey: string,
    public sectorName: string,
    public keyaccountKey: number,
    public keyaccountName: string,
    public socoCustomerNumberGlobalKey: string,
    public socoCustomerNumberGlobalName: string,
    public socoArticleNumberGlobalName: string,
    public socoArticleNumberGlobalKey: string,
    public productLineName: string,
    public productLineKey: string,
    public salesorgName: string,
    public salesorgKey: string,
    public ignoreFlag: IgnoreFlag,
    public lastUpdated: string,
    public eopDateTemp: string,
    public lastEopCalculated: string,
    public eopDateVerified: string,
    public edoDate: string,
    public lastModifier: string,
    public categoryNetSales: string,
    public plantKeysList: string,
    public plantNamesList: string,
    public keyUser: string
  ) {}
}
