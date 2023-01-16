import { StringOption } from '@schaeffler/inputs';

import { AQMCalculationRequest } from './aqm-calculation-request.model';

export interface AQMMaterial extends StringOption {
  id: string;
  data: AQMCalculationRequest;
}
