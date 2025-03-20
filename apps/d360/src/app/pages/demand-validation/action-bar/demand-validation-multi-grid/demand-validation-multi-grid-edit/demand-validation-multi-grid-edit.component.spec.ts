import { Stub } from './../../../../../shared/test/stub.class';
import { DemandValidationMultiGridEditComponent } from './demand-validation-multi-grid-edit.component';

describe('DemandValidationMultiListEditModalComponent', () => {
  let component: DemandValidationMultiGridEditComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DemandValidationMultiGridEditComponent>({
      component: DemandValidationMultiGridEditComponent,
      providers: [
        Stub.getDemandValidationServiceProvider(),
        Stub.getMatDialogDataProvider({
          customerName: 'Test Customer',
          customerNumber: '42',
          materialType: 'schaeffler',
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
