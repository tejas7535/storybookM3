import { RestResponse } from '../../shared/models';
import { JobProfile } from './job-profile.model';

export interface LostJobProfilesResponse extends RestResponse {
  lostJobProfiles: JobProfile[];
}
