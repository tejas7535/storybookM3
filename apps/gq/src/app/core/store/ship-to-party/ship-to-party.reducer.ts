import { ShipToPartyActions } from '@gq/core/store/ship-to-party/ship-to-party.actions';
import { ShipToParty } from '@gq/shared/models/ship-to-party.model';
import { createFeature, createReducer, on } from '@ngrx/store';

const SHIP_TO_PARTY_KEY = 'shipToParty';

export interface ShipToPartyState {
  shipToParties: ShipToParty[];
  shipToPartyLoading: boolean;
  errorMessage: string;
}

export const initialState: ShipToPartyState = {
  shipToParties: [],
  shipToPartyLoading: false,
  errorMessage: undefined,
};

export const shipToPartyFeature = createFeature({
  name: SHIP_TO_PARTY_KEY,
  reducer: createReducer(
    initialState,
    on(
      ShipToPartyActions.getAllShipToParties,
      (state: ShipToPartyState): ShipToPartyState => ({
        ...state,
        shipToPartyLoading: true,
      })
    ),
    on(
      ShipToPartyActions.getAllShipToPartiesSuccess,
      (state: ShipToPartyState, { shipToParties }): ShipToPartyState => ({
        ...state,
        shipToParties,
        shipToPartyLoading: false,
        errorMessage: initialState.errorMessage,
      })
    ),
    on(
      ShipToPartyActions.getAllShipToPartiesFailure,
      (state: ShipToPartyState, { errorMessage }): ShipToPartyState => ({
        ...state,
        shipToParties: [],
        shipToPartyLoading: false,
        errorMessage,
      })
    ),
    on(
      ShipToPartyActions.resetAllShipToParties,
      (_state: ShipToPartyState): ShipToPartyState => ({
        ...initialState,
      })
    )
  ),
});
