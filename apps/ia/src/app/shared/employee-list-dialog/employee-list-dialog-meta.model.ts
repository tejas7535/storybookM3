import { Employee, EmployeeListDialogType } from '../models';
import { EmployeeListDialogMetaHeadings } from './employee-list-dialog-meta-headings.model';

export class EmployeeListDialogMeta {
  public constructor(
    public headings: EmployeeListDialogMetaHeadings,
    public employees: Employee[],
    public showFluctuationType?: boolean,
    public employeeListType?: EmployeeListDialogType
  ) {}
}
