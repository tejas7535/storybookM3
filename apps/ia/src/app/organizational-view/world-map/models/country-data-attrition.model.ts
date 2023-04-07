import { EmployeeAttritionMeta } from '../../../shared/models';

export class CountryDataAttrition {
  public constructor(
    public name: string,
    public countryKey: string,
    public region: string,
    public regionKey: string,
    public attritionMeta: EmployeeAttritionMeta
  ) {}
}
