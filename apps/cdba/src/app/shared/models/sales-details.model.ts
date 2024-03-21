import { SalesOrganizationDetail } from './reference-type.model';

export class SalesDetails {
  constructor(
    public materialNumber: string,
    public materialDesignation: string,
    public materialShortDescription: string,
    public productLine: string,
    public rfq: string,
    public salesOrganizationDetails: SalesOrganizationDetail[],
    public projectName: string,
    public productDescription: string,
    public materialClass: string,
    public materialClassDescription: string
  ) {}
}
