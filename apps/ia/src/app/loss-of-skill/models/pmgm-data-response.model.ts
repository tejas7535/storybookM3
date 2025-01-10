import { RestResponse } from '../../shared/models';
import { PmgmData } from './pmgm-data.model';

export interface PmgmDataResponse extends RestResponse {
  pmgmData: PmgmData[];
}
