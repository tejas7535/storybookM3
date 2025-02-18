import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  createServiceFactory,
  mockProvider,
  Spectator,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';
import { MockModule } from 'ng-mocks';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { ValidationHelper } from './../../../../shared/utils/validation/validation-helper';
import { DemandValidationTableComponent } from './demand-validation-table.component';

describe('DemandValidationTableComponent', () => {
  let spectator: Spectator<DemandValidationTableComponent>;
  let spectator2: SpectatorService<TranslocoLocaleService>;

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

  const createService = createServiceFactory(TranslocoLocaleService);

  beforeEach(() => {
    spectator2 = createService();
    ValidationHelper.localeService = spectator2.service;

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
