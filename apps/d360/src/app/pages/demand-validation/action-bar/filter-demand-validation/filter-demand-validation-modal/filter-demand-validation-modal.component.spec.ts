import { FormGroup } from '@angular/forms';

import { Stub } from '../../../../../shared/test/stub.class';
import { FilterDemandValidationModalComponent } from './filter-demand-validation-modal.component';

describe('FilterDemandValidationModalComponent', () => {
  let component: FilterDemandValidationModalComponent;

  beforeEach(() => {
    component = Stub.get<FilterDemandValidationModalComponent>({
      component: FilterDemandValidationModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({
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
