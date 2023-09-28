import { ActionType } from './action-type.enum';
import { LeavingType } from './leaving-type.enum';

export interface EmployeeWithAction {
  employeeName: string;
  userId: string;
  employeeKey: string;
  exitDate: string;
  entryDate: string;
  reasonForLeaving: LeavingType;
  positionDescription: string;
  orgUnit: string;
  actionType: ActionType;
  dimensionKey: string;
  previousDimensionValue: string;
  nextDimensionValue: string;
  currentDimensionValue: string;
}
