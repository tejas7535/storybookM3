import { EdmStatus } from '../../store/reducers/edm-monitor/models';
import { GcmStatus } from '../../store/reducers/grease-status/models';
import { ShaftStatus } from '../../store/reducers/shaft/models';

export interface MaintenaceSensorData {
  timestamp: string;
  gcm: GcmStatus;
  rsmShaft: ShaftStatus;
  edm: EdmStatus;
}
