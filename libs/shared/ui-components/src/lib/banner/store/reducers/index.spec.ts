import * as fromRoot from './index';

describe('NGRX Store Reducer Index', () => {
  it('should define the reducers object', () => {
    expect(fromRoot.reducers).toBeDefined();
    expect(fromRoot.reducers.banner).toBeDefined();
  });

  it('should define feature selectors', () => {
    expect(fromRoot.getBannerState).toBeDefined();
  });
});
