import { createSelector } from '@ngrx/store';

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
