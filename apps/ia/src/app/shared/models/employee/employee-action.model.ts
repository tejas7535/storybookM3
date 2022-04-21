import { ActionType } from './action-type.enum';

export interface EmployeeAction {
  actionType: ActionType;
  entryDate: string;
  exitDate: string;
  orgUnitInternalChange: string;
}
