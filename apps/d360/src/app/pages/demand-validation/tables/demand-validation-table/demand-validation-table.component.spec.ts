import { Stub } from '../../../../shared/test/stub.class';
import { DemandValidationTableComponent } from './demand-validation-table.component';

describe('DemandValidationTableComponent', () => {
  let component: DemandValidationTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DemandValidationTableComponent>({
      component: DemandValidationTableComponent,
      providers: [
        Stub.getStoreProvider(),
        Stub.getDemandValidationServiceProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
