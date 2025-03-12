import { of } from 'rxjs';

import { Store } from '@ngrx/store';
import { MockProvider } from 'ng-mocks';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { Stub } from '../../../../shared/test/stub.class';
import { DemandValidationTableComponent } from './demand-validation-table.component';

describe('DemandValidationTableComponent', () => {
  let component: DemandValidationTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<DemandValidationTableComponent>({
      component: DemandValidationTableComponent,
      providers: [
        MockProvider(Store, { select: jest.fn().mockReturnValue(of([])) }),
        MockProvider(DemandValidationService, {
          getKpiData: jest.fn().mockReturnValue(of({})),
        }),
        MockProvider(AgGridLocalizationService),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
