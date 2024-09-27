import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { SimulatedQuotation } from '@gq/shared/models';
import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import {
  calculateStatusBarValues,
  multiplyAndRoundValues,
  roundToTwoDecimals,
} from '@gq/shared/utils/pricing.utils';

import { SapConditionType } from '../reducers/models';
import { QuotationIdentifier } from './models';

const QUOTATION_NUMBER_QUERY_PARAMETER = 'quotation_number';
const CUSTOMER_NUMBER_QUERY_PARAMETER = 'customer_number';
const SALES_ORG_QUERY_PARAMETER = 'sales_org';

export const addCalculationsForDetails = (details: QuotationDetail[]): void => {
  details.forEach((detail) => calculateSapPriceValues(detail));
};

export const calculateSapPriceValues = (detail: QuotationDetail): void => {
  if (detail.filteredSapConditionDetails) {
    const rsp = calculateRsp(detail);
    detail.rsp = rsp;

    const zrtu = detail.filteredSapConditionDetails.find(
      (el) => el.sapConditionType === SapConditionType.ZRTU
    )?.amount;
    detail.msp =
      zrtu && detail.rsp ? calculateMsp(detail.rsp, zrtu) : undefined;

    detail.sapVolumeScale =
      detail.filteredSapConditionDetails.find(
        (el) =>
          el.sapConditionType === SapConditionType.ZDVO ||
          el.sapConditionType === SapConditionType.ZEVO
      )?.amount / 100 || undefined;
  }
};

const calculateRsp = (detail: QuotationDetail): number | undefined => {
  const rspCondition = detail.filteredSapConditionDetails.find(
    (el) => el.sapConditionType === SapConditionType.ZMIN
  );
  if (!rspCondition) {
    return undefined;
  }

  let rsp = rspCondition.amount;

  if (
    detail.sapPriceUnit &&
    rspCondition.pricingUnit &&
    detail.sapPriceUnit !== rspCondition.pricingUnit
  ) {
    rsp = multiplyAndRoundValues(
      rsp / rspCondition.pricingUnit,
      detail.sapPriceUnit
    );
  }

  return rsp;
};

export const calculateMsp = (rsp: number, zrtu: number): number => {
  const msp = rsp * (1 - zrtu / 100);

  return roundToTwoDecimals(msp);
};

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

export const buildSimulatedQuotation = (
  gqId: number,
  simulatedField: ColumnFields,
  simulatedDetails: QuotationDetail[],
  details: QuotationDetail[]
): SimulatedQuotation => ({
  gqId,
  simulatedField,
  quotationDetails: simulatedDetails,
  simulatedStatusBar: {
    ...calculateStatusBarValues(getSimulatedDetails(details, simulatedDetails)),
  },
  previousStatusBar: { ...calculateStatusBarValues(details) },
});

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
