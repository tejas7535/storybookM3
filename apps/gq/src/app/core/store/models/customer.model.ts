import { KeyAccount } from './key-account.model';
import { SubKeyAccount } from './sub-key-account.model';

export class Customer {
  public country: string;
  public id: string;
  public incoterms: string;
  public keyAccount: KeyAccount;
  public name: string;
  public paymentTerms: string;
  public region: string;
  public sectorManagement: string;
  public subKeyAccount: SubKeyAccount;
  public subRegion: string;
  public subSector: string;
}
