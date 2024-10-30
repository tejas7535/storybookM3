import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { AlertRulesService } from '../../../../../../feature/alert-rules/alert-rules.service';
import { SelectableOptionsService } from '../../../../../../shared/services/selectable-options.service';
import { SnackbarService } from '../../../../../../shared/utils/service/snackbar.service';
import { AlertRuleDeleteSingleModalComponent } from './alert-rule-delete-single-modal.component';

describe('AlertRuleDeleteSingleModalComponent', () => {
  let spectator: Spectator<AlertRuleDeleteSingleModalComponent>;
  const createComponent = createComponentFactory({
    component: AlertRuleDeleteSingleModalComponent,
    providers: [
      mockProvider(AlertRulesService, {
        getRuleTypeData: jest.fn().mockReturnValue(of([])),
      }),
      MockProvider(MAT_DIALOG_DATA, {
        gridApi: {},
        alertRule: {},
      }),
      mockProvider(SelectableOptionsService, {
        get: jest.fn().mockReturnValue({
          options: [],
          loading: false,
          loadingError: null,
        }),
      }),
      mockProvider(MatDialogRef<AlertRuleDeleteSingleModalComponent>),
      mockProvider(SnackbarService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
