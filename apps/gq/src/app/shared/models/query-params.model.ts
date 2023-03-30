export class ProcessCaseViewQueryParams {
  quotation_number: number;
  customer_number: string;
  sales_org: string;
}
export class DetailViewQueryParams extends ProcessCaseViewQueryParams {
  gqPositionId: string;
}
