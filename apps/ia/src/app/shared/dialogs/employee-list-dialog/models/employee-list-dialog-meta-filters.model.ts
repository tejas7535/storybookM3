export class EmployeeListDialogMetaFilters {
  constructor(
    public filterDimension: string,
    public value: string,
    public timeRange: string,
    public manager?: string,
    public job?: string
  ) {}
}
