import { FilterNames } from '../../../../../shared/components/autocomplete-input/filter-names.enum';
import { IdValue } from '../../../../../shared/models/search';

export class CaseFilterItem {
  filter: FilterNames;
  options: IdValue[];
}
