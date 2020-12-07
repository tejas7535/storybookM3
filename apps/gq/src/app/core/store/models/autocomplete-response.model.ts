import { AutocompleteQuotationResponse } from './autocomplete-sap-quotation-response.model';
import { IdValue } from './id-value.model';

export class AutocompleteResponse {
  public items: IdValue[] | AutocompleteQuotationResponse[];
}
