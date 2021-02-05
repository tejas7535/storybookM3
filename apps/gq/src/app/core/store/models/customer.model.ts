import { AbcClassification, CustomerIds } from '.';

export class Customer {
  public identifiers: CustomerIds;
  public name: string;
  public subSector: string;
  public subSectorId: string;
  public country: string;
  public countryId: string;
  public keyAccount: string;
  public keyAccountId: string;
  public incoterms: string;
  public subKeyAccountId: string;
  public subKeyAccount: string;
  public paymentTerms: string;
  public sectorManagement: string;
  public sector: string;
  public sectorId: string;
  public priceList: string;
  public calculationScheme: string;
  public currency: string;
  public region: string;
  public subRegion: string;
  public customRegion1: string;
  public customRegion2: string;
  public customRegion3: string;
  public sectorCluster: string;
  public sectorClusterChina: string;
  public abcClassification: AbcClassification;
  public yearNetSales: number;
  public yearGPI: number;
  public lastYearNetSales: number;
  public lastYearGPI: number;
}
