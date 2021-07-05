import { RecruitmentSource } from './recruitment-source.enum';

export interface OpenApplication {
  count: number;
  name: string;
  recruitmentSources: RecruitmentSource[];
  approvalDate: Date;
}
