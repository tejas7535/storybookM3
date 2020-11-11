export class EmployeesRequest {
  public constructor(
    public orgUnit: string,
    public regionOrSubRegion: string,
    public country: string,
    public hrLocation: string,
    public timeRange: string
  ) {}
}
