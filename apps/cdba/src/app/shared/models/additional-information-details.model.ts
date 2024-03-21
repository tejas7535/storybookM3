import { SalesOrganizationDetail } from './reference-type.model';

export interface AdditionalInformationDetails {
  plant: string;
  procurementType: string;
  salesOrganizationDetails: SalesOrganizationDetail[];
  actualQuantities: number[];
  plannedQuantities: number[];
}
