export class SalesDetails {
  constructor(
    public materialNumber: string,
    public materialDesignation: string,
    public materialShortDescription: string,
    public productLine: string,
    public rfq: string,
    public salesOrganizations: string[],
    public projectName: string,
    public productDescription: string
  ) {}
}
