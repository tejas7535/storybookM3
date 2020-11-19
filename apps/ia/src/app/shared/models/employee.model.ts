export class Employee {
  public constructor(
    public employeeId: string,
    public employeeName: string,
    public subRegion: string,
    public hrLocation: string,
    public orgUnit: string,
    public businessUnit: string,
    public division: string,
    public jobFamily: string,
    public jobFamilyDescription: string,
    public positionDescription: string,
    public age: number,
    public tenureInYears: number,
    public gender: string,
    public nationality: string,
    public foreigner: string,
    public organizationalLevel: string,
    public parentEmployeeId: string,
    public fte: number,
    public headcount: number,
    public fulltimeParttime: string,
    public exitDate: Date,
    public entryDate: Date,
    public terminationDate: Date,
    public reasonForLeaving: string,
    public regrettedLoss: string,
    public level: number, // only in frontend to hierarchically order employees
    public directSubordinates: number,
    public totalSubordinates: number,
    public directAttrition: number,
    public totalAttrition: number
  ) {}
}
