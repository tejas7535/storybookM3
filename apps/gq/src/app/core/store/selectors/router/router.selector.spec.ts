import { RouterStateUrl } from '../../reducers';
import * as fromRouterSelectors from './router.selector';

describe('RouterSelector', () => {
  const fakeState: RouterStateUrl = {
    url: 'case-view/QUOTATION',
    params: { quotationTab: 'QUOTATION' },
    queryParams: { rfqId: '6' },
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
  describe('getQueryParams', () => {
    test('should return the routeParams', () => {
      expect(
        fromRouterSelectors.getRouteQueryParams.projector(fakeState)
      ).toEqual(fakeState.queryParams);
    });
  });

  describe('getRouteUrl', () => {
    test('should return the routeUrl', () => {
      expect(fromRouterSelectors.getRouteUrl.projector(fakeState)).toEqual(
        fakeState.url
      );
    });
  });
});
