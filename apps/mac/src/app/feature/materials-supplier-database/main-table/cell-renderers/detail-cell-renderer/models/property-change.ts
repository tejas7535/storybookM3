import { CHANGE_STATUS } from './change-status';

export interface PropertyChange {
  property: string;
  previous?: any;
  current?: any;
  reason: CHANGE_STATUS;
}
