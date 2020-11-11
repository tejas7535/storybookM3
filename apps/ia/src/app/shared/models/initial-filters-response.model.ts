import { IdValue } from './id-value.model';

export interface InitialFiltersResponse {
  orgUnits: IdValue[];
  regionsAndSubRegions: IdValue[]; // TODO: after PoC: needs to have dependencies to countries + locations
  countries: IdValue[]; // TODO: after PoC: needs to be dependent on region
  hrLocations: IdValue[]; // TODO: after PoC: needs to be dependent on country
}
