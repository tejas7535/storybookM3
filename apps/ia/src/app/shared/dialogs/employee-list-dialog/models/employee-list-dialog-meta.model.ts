import { EmployeeTableEntry } from '../../../tables/employee-list-table/models';
import { EmployeeListDialogMetaHeadings } from './employee-list-dialog-meta-headings.model';

export class EmployeeListDialogMeta {
  public constructor(
    public headings: EmployeeListDialogMetaHeadings,
    public employees: EmployeeTableEntry[],
    public employeesLoading: boolean,
    public enoughRightsToShowAllEmployees: boolean,
    public type: 'workforce' | 'leavers' | 'newJoiners',
    public excludedColumns?: string[],
    public customExcelFileName?: string
  ) {}
}
