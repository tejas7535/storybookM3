import { IdValue } from './id-value.model';

export class SapQuotation extends IdValue {
  constructor(
    public id: string,
    public value: string,
    public selected: boolean,
    public imported: boolean,
    public customerId: string,
    public gqImportedUser: {
      id: string;
      name: string;
    }
  ) {
    super(id, value, selected);
  }
}
