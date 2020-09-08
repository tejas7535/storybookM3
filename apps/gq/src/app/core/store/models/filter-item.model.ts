import { IdValue } from './id-value.model';

export class FilterItem {
  public constructor(public filter: string, public options: IdValue[]) {}
}
