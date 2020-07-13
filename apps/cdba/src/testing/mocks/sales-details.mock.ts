import { SalesDetails } from '../../app/detail/sales-and-description/model/sales-details.model';
import { REFRENCE_TYPE_MOCK } from './reference-type.mock';

export const SALES_DETAILS_MOCK: SalesDetails = new SalesDetails(
  REFRENCE_TYPE_MOCK.materialNumber,
  REFRENCE_TYPE_MOCK.materialDesignation,
  REFRENCE_TYPE_MOCK.materialShortDescription,
  REFRENCE_TYPE_MOCK.productLine,
  REFRENCE_TYPE_MOCK.rfq,
  REFRENCE_TYPE_MOCK.salesOrganization,
  REFRENCE_TYPE_MOCK.projectName,
  REFRENCE_TYPE_MOCK.productDescription
);
