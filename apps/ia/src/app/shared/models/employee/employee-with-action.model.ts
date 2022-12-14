import { LeavingType } from '../../../overview/models';
import { ActionType } from './action-type.enum';

export interface EmployeeWithAction {
  employeeName: string;
  userId: string;
  exitDate: string;
  entryDate: string;
  reasonForLeaving: LeavingType;
  positionDescription: string;
  orgUnit: string;
  actionType: ActionType;
}
