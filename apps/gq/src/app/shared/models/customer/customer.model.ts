import { AccountPotential } from './account-potential.model';
import { CustomerId } from './customer-ids.model';
import { CustomerSalesInformation } from './customer-sales-information.interface';
import { MarginDetail } from './margin-detail.model';
import { NetSalesClassification } from './net-sales-classification';

export class Customer {
  public identifier: CustomerId;
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
  public paymentTermsDescription: string;
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
  public netSalesClassification: NetSalesClassification;
  public marginDetail: MarginDetail;
  public accountPotential: AccountPotential;
  public salesInformation: CustomerSalesInformation;
  public enabledForApprovalWorkflow: boolean;
}
