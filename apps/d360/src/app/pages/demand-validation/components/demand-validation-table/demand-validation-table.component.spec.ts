import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { MockModule } from 'ng-mocks';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { DemandValidationTableComponent } from './demand-validation-table.component';

describe('DemandValidationTableComponent', () => {
  let spectator: Spectator<DemandValidationTableComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationTableComponent,
    imports: [MockModule(AgGridModule)],
    providers: [
      mockProvider(Store, {
        select: jest.fn().mockReturnValue(of({})),
      }),
      mockProvider(TranslocoLocaleService, {}),
      mockProvider(DemandValidationService, {
        getKpiData: jest.fn().mockReturnValue(of({})),
      }),
      mockProvider(AgGridLocalizationService, {
        lang: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        materialListEntry: {},
        planningView: PlanningView.REQUESTED,
        kpiDateRange: { range1: null },
        reloadRequired: 0,
        showLoader: false,
        confirmContinueAndLooseUnsavedChanges: () => false,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
