import { HttpClient } from '@angular/common/http';
import { DestroyRef } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { getBackendRoles } from '@schaeffler/azure-auth';

import { DemandValidationService } from '../../../feature/demand-validation/demand-validation.service';
import { PlanningView } from '../../../feature/demand-validation/planning-view';
import { CustomerEntry } from '../../../feature/global-selection/model';
import { SnackbarService } from '../../../shared/utils/service/snackbar.service';
import { ActionBarComponent } from './action-bar.component';
import { DatePickerSettingDemandValidationModalComponent } from './date-picker-setting-demand-validation-modal/date-picker-setting-demand-validation-modal.component';

describe('ActionBarComponent', () => {
  let spectator: Spectator<ActionBarComponent>;

  const createComponent = createComponentFactory({
    component: ActionBarComponent,
    componentMocks: [
      MockComponent(DatePickerSettingDemandValidationModalComponent),
    ],
    providers: [
      mockProvider(MatDialog, {
        open: jest.fn(),
      }),
      mockProvider(DateAdapter),
      mockProvider(DestroyRef),
      mockProvider(SnackbarService, { openSnackBar: jest.fn() }),
      mockProvider(DemandValidationService, {
        saveValidatedDemandSingleMcc: jest.fn().mockReturnValue(of(null)),
      }),
      provideMockStore({
        initialState: { accountInfo: { backendRoles: { entities: [] } } },
        selectors: [{ selector: getBackendRoles, value: ['Book 1', 'Book 2'] }],
      }),
      mockProvider(HttpClient, { get: () => of({}), post: () => of({}) }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        selectedCustomer: {} as CustomerEntry,
        customerData: [],
        planningView: PlanningView.REQUESTED,
        demandValidationFilters: {
          customerMaterialNumber: [],
          productLine: [],
          productionLine: [],
          stochasticType: [],
        },
        isMaterialListVisible: true,
        changedKPIs: null,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
