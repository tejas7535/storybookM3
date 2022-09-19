import { EmployeeWithAction } from '../models';
import { EmployeeListDialogMetaHeadings } from './employee-list-dialog-meta-headings.model';

export class EmployeeListDialogMeta {
  public constructor(
    public headings: EmployeeListDialogMetaHeadings,
    public employees: EmployeeWithAction[],
    public employeesLoading: boolean,
    public enoughRightsToShowAllEmployees: boolean,
    public showFluctuationType?: boolean
  ) {}
}
