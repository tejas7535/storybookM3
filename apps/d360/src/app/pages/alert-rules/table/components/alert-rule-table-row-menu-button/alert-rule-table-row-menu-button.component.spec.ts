import { MatDialog } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { ICellRendererParams } from 'ag-grid-community';
import { MockComponent } from 'ng-mocks';

import { AlertRulesService } from '../../../../../feature/alert-rules/alert-rules.service';
import { AlertRule } from '../../../../../feature/alert-rules/model';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import { AlertRuleEditSingleModalComponent } from '../modals/alert-rule-edit-single-modal/alert-rule-edit-single-modal.component';
import { AlertRuleTableRowMenuButtonComponent } from './alert-rule-table-row-menu-button.component';

describe('AlertRuleTableRowMenuButtonComponent', () => {
  let spectator: Spectator<AlertRuleTableRowMenuButtonComponent>;
  const createComponent = createComponentFactory({
    component: AlertRuleTableRowMenuButtonComponent,
    imports: [MockComponent(AlertRuleEditSingleModalComponent)],
    componentMocks: [],
    providers: [
      mockProvider(SnackbarService),
      mockProvider(AlertRulesService),
      mockProvider(MatDialog),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });

    spectator.component.agInit({
      data: {} as AlertRule,
    } as ICellRendererParams);

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
