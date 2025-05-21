import { Stub } from '../../../../test/stub.class';
import { GridLoadingComponent } from './grid-loading.component';

describe('GridLoadingComponent', () => {
  let component: GridLoadingComponent;

  beforeEach(() => {
    component = Stub.get<GridLoadingComponent>({
      component: GridLoadingComponent,
    });
  });

  describe('agInit', () => {
    it('should initialize the params property with the provided parameters', () => {
      const mockParams = {
        loadingMessage: 'Loading data...',
      };

      component.agInit(mockParams as any);

      expect(component.params).toEqual(mockParams);
    });
  });
});
