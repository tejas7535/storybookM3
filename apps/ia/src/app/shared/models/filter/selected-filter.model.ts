import { IdValue } from '../id-value.model';

export class SelectedFilter {
  public constructor(
    public name: string,
    public idValue: IdValue
  ) {}
}
