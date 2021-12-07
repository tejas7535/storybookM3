import { HeatType } from './heat-type.enum';

export class EmployeeAttritionMeta {
  public constructor(
    public title: string,
    public attritionRate: number,
    public unforcedAttritionRate: number,
    public employeesLost: number,
    public naturalTurnover: number,
    public forcedLeavers: number,
    public unforcedLeavers: number,
    public terminationReceived: number,
    public employeesAdded: number,
    public openPositions: number,
    public heatType: HeatType = HeatType.NONE
  ) {}
}
