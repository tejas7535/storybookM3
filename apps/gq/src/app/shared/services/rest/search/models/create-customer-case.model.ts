import { PLsSeriesRequest } from './pls-series-request.model';

export interface CreateCustomerCase extends PLsSeriesRequest {
  productLines: string[];
  series: string[];
  gpsdGroupIds: string[];
}
