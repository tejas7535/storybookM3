import { ShipToParty } from '@gq/shared/models/ship-to-party.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ShipToPartyActions = createActionGroup({
  source: 'Ship To Party',
  events: {
    'get all ship to parties': props<{
      customerId: string;
      salesOrg: string;
    }>(),
    'get all ship to parties success': props<{
      shipToParties: ShipToParty[];
    }>(),
    'get all ship to parties failure': props<{ errorMessage: string }>(),
    'select ship to party': props<{ shipToParty: ShipToParty }>(),
    'reset all ship to parties': emptyProps(),
  },
});
