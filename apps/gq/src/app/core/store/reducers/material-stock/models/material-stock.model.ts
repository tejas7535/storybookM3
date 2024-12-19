import { Plant } from '@gq/shared/models';
import { MaterialDetails } from '@gq/shared/models/quotation-detail/material';

export interface MaterialStock {
  material: MaterialDetails;
  plant: Plant;
  excessStock: boolean;
  slowMover: boolean;
}
