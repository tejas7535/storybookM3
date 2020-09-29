import { IdValue } from './id-value.model';

export class AutocompleteResponse {
  public constructor(public items: IdValue[]) {}
}
