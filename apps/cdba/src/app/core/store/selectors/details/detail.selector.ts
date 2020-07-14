import { createSelector } from '@ngrx/store';

import { CustomerDetailsModel } from '../../../../detail/customer/model/customer.details.model';
import { DimensionAndWeightDetails } from '../../../../detail/dimension-and-weight/model/dimension-and-weight-details.model';
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

export const getDimensionAndWeightDetails = createSelector(
  getReferenceType,
  (referenceType) => {
    return new DimensionAndWeightDetails(
      referenceType.height,
      referenceType.width,
      referenceType.length,
      referenceType.unitOfDimension,
      referenceType.volumeCubic,
      referenceType.volumeUnit,
      referenceType.weight,
      referenceType.weightUnit
    );
  }
);

export const getCustomerDetails = createSelector(
  getReferenceType,
  (referenceType) => {
    return new CustomerDetailsModel(
      referenceType.customer,
      referenceType.customerGroup
    );
  }
);
