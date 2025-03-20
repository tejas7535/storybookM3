import { of } from 'rxjs';

import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationLoadingModalComponent } from './demand-validation-loading-modal.component';

describe('DemandValidationLoadingModalComponent', () => {
  let component: DemandValidationLoadingModalComponent;

  beforeEach(() => {
    component = Stub.get<DemandValidationLoadingModalComponent>({
      component: DemandValidationLoadingModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          textWhileLoading: 'Loading...',
          onInit: jest.fn().mockReturnValue(of(null)),
          onClose: jest.fn(),
        }),
        Stub.getMatDialogProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
