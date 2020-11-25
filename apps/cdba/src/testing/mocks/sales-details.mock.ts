import { SalesDetails } from '../../app/detail/detail-tab/sales-and-description/model/sales-details.model';
import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const SALES_DETAILS_MOCK: SalesDetails = new SalesDetails(
  REFERENCE_TYPE_MOCK.materialNumber,
  REFERENCE_TYPE_MOCK.materialDesignation,
  REFERENCE_TYPE_MOCK.materialShortDescription,
  REFERENCE_TYPE_MOCK.productLine,
  REFERENCE_TYPE_MOCK.rfq,
  REFERENCE_TYPE_MOCK.salesOrganization,
  REFERENCE_TYPE_MOCK.projectName,
  REFERENCE_TYPE_MOCK.productDescription
);
