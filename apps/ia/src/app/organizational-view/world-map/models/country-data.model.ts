import { EmployeeAttritionMeta } from '../../../shared/models';

export class CountryData {
  public constructor(
    public name: string,
    public continent: string,
    public attritionMeta: EmployeeAttritionMeta
  ) {}
}
