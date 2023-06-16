import { MaterialDetails } from '@gq/shared/models/quotation-detail/';
import { Plant } from '@gq/shared/models/quotation-detail/';

export interface MaterialStock {
  material: MaterialDetails;
  plant: Plant;
  excessStock: boolean;
  slowMover: boolean;
}
