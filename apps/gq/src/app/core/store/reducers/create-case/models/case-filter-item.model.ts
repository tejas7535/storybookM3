import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { IdValue } from '@gq/shared/models/search';

export class CaseFilterItem {
  filter: FilterNames;
  options: IdValue[];
}
