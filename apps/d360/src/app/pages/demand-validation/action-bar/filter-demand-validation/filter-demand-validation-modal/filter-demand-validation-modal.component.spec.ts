import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MockProvider } from 'ng-mocks';

import { Stub } from '../../../../../shared/test/stub.class';
import { FilterDemandValidationModalComponent } from './filter-demand-validation-modal.component';

describe('FilterDemandValidationModalComponent', () => {
  let component: FilterDemandValidationModalComponent;

  beforeEach(() => {
    component = Stub.get<FilterDemandValidationModalComponent>({
      component: FilterDemandValidationModalComponent,
      providers: [
        MockProvider(MAT_DIALOG_DATA, {
          formGroup: new FormGroup({}),
          activeFilterFn: jest.fn().mockReturnValue(1),
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
