import { EmployeeListDialogMetaFilters } from '.';

export class EmployeeListDialogMetaHeadings {
  public constructor(
    public header: string,
    public icon: string,
    public showDefaultFilters = true,
    public customBeautifiedFilters?: EmployeeListDialogMetaFilters,
    public customExcelFileName?: string
  ) {}
}
