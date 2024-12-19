import { HttpClient } from '@angular/common/http';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import { ActionBarComponent } from './action-bar.component';
import { DatePickerSettingDemandValidationModalComponent } from './date-picker-setting-demand-validation-modal/date-picker-setting-demand-validation-modal.component';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key} mocked`),
}));

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
      mockProvider(Store, {
        select: jest.fn().mockReturnValue(of([])),
      }),
      mockProvider(HttpClient, { get: () => of({}) }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        currentCustomer: {} as CustomerEntry,
        customerData: [],
        planningView: PlanningView.REQUESTED,
        isMaterialListVisible: true,
        changedKPIs: null,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
