import { QuotationDetail } from '@gq/shared/models/quotation-detail';

import { QuotationIdentifier } from './models';

const QUOTATION_NUMBER_QUERY_PARAMETER = 'quotation_number';
const CUSTOMER_NUMBER_QUERY_PARAMETER = 'customer_number';
const SALES_ORG_QUERY_PARAMETER = 'sales_org';

export const mapQueryParamsToIdentifier = (
  queryParams: any
): {
  gqId: number;
  customerNumber: string;
  salesOrg: string;
} => {
  const gqId: number = +queryParams[QUOTATION_NUMBER_QUERY_PARAMETER];
  const customerNumber: string = queryParams[CUSTOMER_NUMBER_QUERY_PARAMETER];
  const salesOrg: string = queryParams[SALES_ORG_QUERY_PARAMETER];

  return gqId && customerNumber && salesOrg
    ? { gqId, customerNumber, salesOrg }
    : undefined;
};

export const mapQuotationIdentifierToQueryParamsString = (
  quotationIdentifier: QuotationIdentifier
): string => {
  const queryParams: {
    [queryParam: string]: string | number;
  } = {
    [QUOTATION_NUMBER_QUERY_PARAMETER]: quotationIdentifier.gqId,
    [CUSTOMER_NUMBER_QUERY_PARAMETER]: quotationIdentifier.customerNumber,
    [SALES_ORG_QUERY_PARAMETER]: quotationIdentifier.salesOrg,
  };

  return Object.keys(queryParams)
    .map((queryParam: string) => `${queryParam}=${queryParams[queryParam]}`)
    .join('&');
};

export const checkEqualityOfIdentifier = (
  fromRoute: QuotationIdentifier,
  current: QuotationIdentifier
): boolean =>
  fromRoute.customerNumber === current?.customerNumber &&
  fromRoute.gqId === current?.gqId &&
  fromRoute.salesOrg === current?.salesOrg;

export const getSimulatedDetails = (
  details: QuotationDetail[],
  simulatedDetails: QuotationDetail[]
): QuotationDetail[] =>
  details.map(
    (detail) =>
      simulatedDetails.find(
        (simulatedDetail) =>
          detail.quotationItemId === simulatedDetail.quotationItemId
      ) || detail
  );

export const sortQuotationDetails = (
  quotationDetails: QuotationDetail[]
): QuotationDetail[] =>
  [...quotationDetails].sort((a, b) => a.quotationItemId - b.quotationItemId);
