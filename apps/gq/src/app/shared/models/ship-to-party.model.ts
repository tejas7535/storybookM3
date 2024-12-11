export interface ShipToPartyResponse {
  results: ShipToParty[];
}

export interface ShipToParty {
  customerId: string;
  salesOrg: string;
  customerName: string;
  countryName: string;
  defaultCustomer: boolean;
}
