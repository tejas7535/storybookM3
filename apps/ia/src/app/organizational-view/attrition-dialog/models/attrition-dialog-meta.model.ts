import { EmployeeAttritionMeta } from '../../../shared/models';

export class AttritionDialogMeta {
  public constructor(
    public data: EmployeeAttritionMeta,
    public selectedTimeRange: string,
    public showAttritionRates: boolean = true
  ) {}
}
