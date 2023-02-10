export class AutocompleteSearch {
  public constructor(
    public filter: string,
    public searchFor: string,
    public limit?: number
  ) {}
}
