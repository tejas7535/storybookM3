import { OfferTypeActions } from './offer-type.actions';
import { initialState, offerTypeFeature } from './offer-type.reducer';

describe('offerTypeReducer', () => {
  describe('getAllOfferTypes', () => {
    test('should set offerTypeLoading to true', () => {
      const action = OfferTypeActions.getAllOfferTypes();
      const state = offerTypeFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        offerTypeLoading: true,
      });
    });
    test('should set offerTypeLoading to false and set offerTypes', () => {
      const offerTypes = [{ name: 'test', id: 1 }];
      const action = OfferTypeActions.getAllOfferTypesSuccess({
        offerTypes,
      });
      const state = offerTypeFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        offerTypes,
        offerTypeLoading: false,
        errorMessage: undefined,
      });
    });
    test('should set offerTypeLoading to false and set errorMessage', () => {
      const errorMessage = 'this is an error message';
      const action = OfferTypeActions.getAllOfferTypesFailure({
        errorMessage,
      });
      const state = offerTypeFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        offerTypes: [],
        offerTypeLoading: false,
        errorMessage,
      });
    });
  });

  describe('extraSelectors', () => {
    test('should return selectedOfferType', () => {
      expect(
        offerTypeFeature.getSelectedOfferType.projector({
          name: 'test',
          id: 1,
        })
      ).toEqual({ name: 'test', id: 1 });
    });
  });
});
