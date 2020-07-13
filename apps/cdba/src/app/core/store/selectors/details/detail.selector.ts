import { createSelector } from '@ngrx/store';

import { PriceDetails } from '../../../../detail/pricing/model/price.details.model';
import { SalesDetails } from '../../../../detail/sales-and-description/model/sales-details.model';
import { getDetailState } from '../../reducers';
import { DetailState } from '../../reducers/detail/detail.reducer';

export const getReferenceType = createSelector(
  getDetailState,
  (state: DetailState) => state.detail.referenceType
);

export const getSalesDetails = createSelector(
  getReferenceType,
  (referenceType) => {
    return new SalesDetails(
      referenceType.materialNumber,
      referenceType.materialDesignation,
      referenceType.materialShortDescription,
      referenceType.productLine,
      referenceType.rfq,
      referenceType.salesOrganization,
      referenceType.projectName,
      referenceType.productDescription
    );
  }
);

export const getPriceDetails = createSelector(
  getReferenceType,
  (referenceType) => {
    return new PriceDetails(
      referenceType.pcmSqv,
      referenceType.pcmCalculationDate,
      referenceType.sqvSapLatestMonth,
      referenceType.sqvDate,
      referenceType.gpcLatestYear,
      referenceType.gpcDate,
      referenceType.puUm
    );
  }
);
