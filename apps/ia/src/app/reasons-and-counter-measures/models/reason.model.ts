import { ReasonImpact } from '.';

export interface Reason {
  interviewId: number;
  impact: ReasonImpact;
  reason: string;
  reasonId: number;
  detailedReason: string;
  detailedReasonId: number;
}
