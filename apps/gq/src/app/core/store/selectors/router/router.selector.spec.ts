import { RouterStateUrl } from '../../reducers';
import * as fromRouterSelectors from './router.selector';

describe('RouterSelector', () => {
  const fakeState: RouterStateUrl = {
    url: 'case-view/QUOTATION',
    params: { quotationTab: 'QUOTATION' },
    queryParams: {},
  };
  describe('getRouteState', () => {
    test('should return the router state', () => {
      expect(
        fromRouterSelectors.getRouteState.projector({
          state: fakeState,
          navigationId: 1,
        })
      ).toEqual(fakeState);
    });
  });

  describe('getRouteParams', () => {
    test('should return the routeParams', () => {
      expect(fromRouterSelectors.getRouteParams.projector(fakeState)).toEqual(
        fakeState.params
      );
    });
  });
});
