import { RestResponse } from '../../shared/models';
import { PmgmDataDto } from './pmgm-data-dto.model';

export interface PmgmDataDtoResponse extends RestResponse {
  pmgmData: PmgmDataDto[];
}
