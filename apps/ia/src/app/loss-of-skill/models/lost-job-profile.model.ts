import { Employee } from '../../shared/models';
import { JobProfile } from './job-profile.model';

export class LostJobProfile implements JobProfile {
  public constructor(
    public openPositions: number,
    public positionDescription: string,
    public leavers: Employee[],
    public employees: Employee[]
  ) {}
}
