import { QuotationDetail } from '@gq/shared/models';

export const mailFallback = '<or-swe-global-pricing-industry@schaeffler.com>';
export const getMailSubjectString = (
  quotationDetail: QuotationDetail
): string =>
  `Missing Calculator User for ${quotationDetail.productionPlant.plantNumber} / ${quotationDetail.material.productLineId}`;

export const getMailBodyString = (
  users: string,
  quotationDetail: QuotationDetail
): string =>
  `Dear ${users},
the routing to responsible calculation department failed. Please maintain the related SAP-table with the correct calculator(-pool) and inform Sales-User afterwards to start the workflow again.

Material Description: ${quotationDetail.material.materialDescription}
Production Plant: ${quotationDetail.productionPlant.plantNumber} ${quotationDetail.productionPlant.city}
Product Line: ${quotationDetail.material.productLineId}
Product Hierarchy: ${quotationDetail.material.productHierarchyId}

Thank you very much

Guided Quoting`;

export const getSeperatedNamesOfMaintainers = (
  maintainerNames: string[],
  lastItemSeperator: string
) => {
  if (maintainerNames.length === 0) {
    return mailFallback;
  }
  if (maintainerNames.length === 1) {
    return maintainerNames[0];
  }
  const lastItem = maintainerNames.pop();

  return `${maintainerNames.join(', ')} ${lastItemSeperator} ${lastItem}`;
};
