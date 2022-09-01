import { EmployeeAttritionMeta } from '../../../shared/models';

export class CountryData {
  public constructor(
    public name: string,
    public region: string,
    public attritionMeta: EmployeeAttritionMeta
  ) {}
}
