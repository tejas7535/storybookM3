import { IdValue } from './id-value.model';

export class Filter {
  public constructor(public name: string, public options: IdValue[]) {}
}
