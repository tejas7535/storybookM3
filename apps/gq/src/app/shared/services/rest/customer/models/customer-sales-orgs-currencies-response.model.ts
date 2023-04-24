export class CustomerSalesOrgsCurrenciesResponse {
  customerId: string;
  salesOrgCurrencyList: SalesOrgCurrency[];
}

export class SalesOrgCurrency {
  salesOrg: string;
  currency: string;
}
