import { Stub } from '../../../../shared/test/stub.class';
import { GlobalSelectionCriteriaComponent } from './global-selection-criteria.component';

describe('GlobalSelectionCriteriaComponent', () => {
  let component: GlobalSelectionCriteriaComponent;

  beforeEach(() => {
    component = Stub.get<GlobalSelectionCriteriaComponent>({
      component: GlobalSelectionCriteriaComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
