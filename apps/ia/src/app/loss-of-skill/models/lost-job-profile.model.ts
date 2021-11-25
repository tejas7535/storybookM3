import { JobProfile } from './job-profile.model';

export class LostJobProfile implements JobProfile {
  public constructor(
    public openPositions: number,
    public positionDescription: string,
    public leavers: string[],
    public employees: string[]
  ) {}
}
