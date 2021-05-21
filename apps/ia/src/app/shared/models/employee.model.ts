import { EmployeeAttritionMeta } from './employee-attrition-meta.model';

export class Employee {
  public constructor(
    public employeeId: string,
    public employeeName: string,
    public subRegion: string,
    public hrLocation: string,
    public country: string,
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
    public exitDate: string,
    public entryDate: string,
    public terminationDate: string,
    public reasonForLeaving: string,
    public regrettedLoss: string,
    public level: number,
    public directSubordinates: number,
    public totalSubordinates: number,
    public directAttrition: number,
    public totalAttrition: number,
    public attritionMeta: EmployeeAttritionMeta,
    public directLeafChildren: Employee[]
  ) {}
}
