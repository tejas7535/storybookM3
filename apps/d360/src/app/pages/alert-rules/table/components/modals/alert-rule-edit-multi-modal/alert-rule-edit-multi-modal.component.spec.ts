import { MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { AlertRulesService } from '../../../../../../feature/alert-rules/alert-rules.service';
import { SelectableOptionsService } from '../../../../../../shared/services/selectable-options.service';
import { AlertRuleDeleteMultiModalComponent } from '../alert-rule-delete-multi-modal/alert-rule-delete-multi-modal.component';
import { AlertRuleEditMultiModalComponent } from './alert-rule-edit-multi-modal.component';

describe('AlertRuleEditMultiModalComponent', () => {
  let spectator: Spectator<AlertRuleEditMultiModalComponent>;
  const createComponent = createComponentFactory({
    component: AlertRuleEditMultiModalComponent,
    providers: [
      mockProvider(AlertRulesService, {
        getRuleTypeData: jest.fn().mockReturnValue(of([])),
      }),
      mockProvider(SelectableOptionsService, {
        get: jest.fn().mockReturnValue({
          options: [],
          loading: false,
          loadingError: null,
        }),
      }),
      mockProvider(MatDialogRef<AlertRuleDeleteMultiModalComponent>),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
