import { LeavingType } from '../../../overview/models';
import { ActionType } from '../../models';
import { EmployeeListDialogMetaHeadings } from './employee-list-dialog-meta-headings.model';

export class EmployeeListDialogMeta {
  public constructor(
    public headings: EmployeeListDialogMetaHeadings,
    public employees: {
      employeeName: string;
      userId: string;
      employeeKey: string;
      positionDescription: string;
      orgUnit: string;
      actionType?: ActionType;
      reasonForLeaving?: LeavingType;
      entryDate?: string;
      exitDate?: string;
    }[],
    public employeesLoading: boolean,
    public enoughRightsToShowAllEmployees: boolean,
    public listItemHeight: number,
    public showFluctuationTypeOnTeamMemberDialog?: boolean
  ) {}
}
