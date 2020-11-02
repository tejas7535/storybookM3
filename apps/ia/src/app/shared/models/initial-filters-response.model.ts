import { IdValue } from './id-value.model';

export interface InitialFiltersResponse {
  organizations: IdValue[];
  regionAndSubRegions: IdValue[]; // TODO: after PoC: needs to have dependencies to countries + locations
  countries: IdValue[]; // TODO: after PoC: needs to be dependent on region
  locations: IdValue[]; // TODO: after PoC: needs to be dependent on country
}
