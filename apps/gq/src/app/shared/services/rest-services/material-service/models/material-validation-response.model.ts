import { CustomerId } from '../../../../models/customer';
import { MaterialValidation } from '../../../../models/table';

export interface MaterialValidationResponse {
  customerId: CustomerId;
  validatedMaterials: MaterialValidation[];
}
