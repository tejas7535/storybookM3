import { QuotationDetail } from '@gq/shared/models';

export const getMailSubjectString = (
  quotationDetail: QuotationDetail
): string =>
  `Missing Calculator User for ${quotationDetail.productionPlant.plantNumber} / ${quotationDetail.material.productLineId}`;

export const getMailBodyString = (
  personA: string,
  personB: string,
  quotationDetail: QuotationDetail
): string =>
  `Dear ${personA} and ${personB},
the routing to responsible calculation department failed. Please maintain the related SAP-table with the correct calculator(-pool) and inform Sales-User afterwards to start the workflow again.

Material Description: ${quotationDetail.material.materialDescription}
Production Plant: ${quotationDetail.productionPlant.plantNumber} ${quotationDetail.productionPlant.city}
Product Line: ${quotationDetail.material.productLineId}
Product Hierarchy: ${quotationDetail.material.productHierarchyId}

Thank you very much

Guided Quoting`;
