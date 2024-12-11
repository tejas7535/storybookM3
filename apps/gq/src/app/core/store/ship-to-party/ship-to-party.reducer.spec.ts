import { ShipToPartyActions } from '@gq/core/store/ship-to-party/ship-to-party.actions';
import {
  initialState,
  shipToPartyFeature,
} from '@gq/core/store/ship-to-party/ship-to-party.reducer';
import { ShipToParty } from '@gq/shared/models/ship-to-party.model';

describe('shipToPartyReducer', () => {
  describe('getAllShipToParties', () => {
    test('should set shipToPartyLoading to true', () => {
      const action = ShipToPartyActions.getAllShipToParties({
        customerId: 'test',
        salesOrg: 'test',
      });
      const state = shipToPartyFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        shipToPartyLoading: true,
      });
    });
    test('should set shipToPartyLoading to false and set shipToParties', () => {
      const shipToParties: ShipToParty[] = [];
      const action = ShipToPartyActions.getAllShipToPartiesSuccess({
        shipToParties,
      });
      const state = shipToPartyFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        shipToParties,
        shipToPartyLoading: false,
        errorMessage: undefined,
      });
    });
    test('should set shipToPartyLoading to false and set errorMessage', () => {
      const errorMessage = 'this is an error message';
      const action = ShipToPartyActions.getAllShipToPartiesFailure({
        errorMessage,
      });
      const state = shipToPartyFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        shipToParties: [],
        shipToPartyLoading: false,
        errorMessage,
      });
    });
    test('should set initial state', () => {
      const action = ShipToPartyActions.resetAllShipToParties();
      const state = shipToPartyFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
      });
    });
  });
});
