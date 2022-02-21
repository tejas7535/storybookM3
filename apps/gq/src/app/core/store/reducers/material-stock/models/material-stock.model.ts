import {
  MaterialDetails,
  Plant,
} from '../../../../../shared/models/quotation-detail/';

export interface MaterialStock {
  material: MaterialDetails;
  plant: Plant;
  excessStock: boolean;
  slowMover: boolean;
}
