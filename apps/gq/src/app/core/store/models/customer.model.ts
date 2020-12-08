import { KeyAccount } from './key-account.model';
import { SectorManagement } from './sector-management.model';
import { SubKeyAccount } from './sub-key-account.model';
import { SubSector } from './sub-sector.model';

export class Customer {
  public country: string;
  public id: string;
  public incoterms: string;
  public keyAccount: KeyAccount;
  public name: string;
  public paymentTerms: string;
  public region: string;
  public sectorManagement: SectorManagement;
  public subKeyAccount: SubKeyAccount;
  public subRegion: string;
  public subSector: SubSector;
}
