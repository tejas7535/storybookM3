import { CustomerId } from '../customer';

export class AutocompleteSearch {
  public constructor(
    public filter: string,
    public searchFor: string,
    public limit?: number,
    public customerIdentifier?: CustomerId
  ) {}
}
