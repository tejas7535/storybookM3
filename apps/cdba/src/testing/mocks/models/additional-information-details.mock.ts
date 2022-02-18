import { AdditionalInformationDetails } from '@cdba/shared/models';

import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const ADDITIONAL_INFORMATION_DETAILS_MOCK: AdditionalInformationDetails =
  {
    plant: REFERENCE_TYPE_MOCK.plant,
    procurementType: REFERENCE_TYPE_MOCK.procurementType,
    salesOrganizations: REFERENCE_TYPE_MOCK.salesOrganizations,
    actualQuantities: REFERENCE_TYPE_MOCK.actualQuantities,
    plannedQuantities: REFERENCE_TYPE_MOCK.plannedQuantities,
  };
