import { ActionType, LeavingType } from '../../../models';

export class EmployeeTableEntry {
  constructor(
    public employeeName: string,
    public userId: string,
    public employeeKey: string,
    public positionDescription: string,
    public orgUnit: string,
    public actionType?: ActionType,
    public reasonForLeaving?: LeavingType,
    public entryDate?: string,
    public exitDate?: string
  ) {}
}
