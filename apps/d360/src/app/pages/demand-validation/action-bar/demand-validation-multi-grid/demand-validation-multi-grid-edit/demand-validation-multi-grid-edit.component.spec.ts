import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { DemandValidationService } from './../../../../../feature/demand-validation/demand-validation.service';
import { Stub } from './../../../../../shared/test/stub.class';
import { DemandValidationMultiGridEditComponent } from './demand-validation-multi-grid-edit.component';

describe('DemandValidationMultiListEditModalComponent', () => {
  let component: DemandValidationMultiGridEditComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DemandValidationMultiGridEditComponent>({
      component: DemandValidationMultiGridEditComponent,
      providers: [
        MockProvider(DemandValidationService, {
          getKpiBuckets: jest.fn().mockReturnValue(of([])),
        }),
        MockProvider(MAT_DIALOG_DATA, {
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
