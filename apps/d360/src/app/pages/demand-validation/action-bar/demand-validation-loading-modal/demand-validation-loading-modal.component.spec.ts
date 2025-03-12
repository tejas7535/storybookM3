import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationLoadingModalComponent } from './demand-validation-loading-modal.component';

describe('DemandValidationLoadingModalComponent', () => {
  let component: DemandValidationLoadingModalComponent;

  beforeEach(() => {
    component = Stub.get<DemandValidationLoadingModalComponent>({
      component: DemandValidationLoadingModalComponent,
      providers: [
        MockProvider(MAT_DIALOG_DATA, {
          textWhileLoading: 'Loading...',
          onInit: jest.fn().mockReturnValue(of(null)),
          onClose: jest.fn(),
        }),
        MockProvider(MatDialog),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
