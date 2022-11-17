import { RestResponse } from '../../shared/models';
import { Workforce } from './workforce.model';

export interface WorkforceResponse extends RestResponse {
  employees: Workforce[];
}
