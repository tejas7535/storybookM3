import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { MockModule } from 'ng-mocks';

import { AlertRulesService } from '../../../../../feature/alert-rules/alert-rules.service';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { AlertRulesColumnSettingsService } from '../../services/alert-rules-column-settings.service';
import { AlertRuleTableComponent } from './alert-rule-table.component';

describe('AlertRuleTableComponent', () => {
  let spectator: Spectator<AlertRuleTableComponent>;
  const createComponent = createComponentFactory({
    component: AlertRuleTableComponent,
    componentMocks: [],
    imports: [MockModule(AgGridModule)],
    providers: [
      mockProvider(AlertRulesService, {
        getAlertRuleData: jest.fn().mockReturnValue(of({})),
      }),
      mockProvider(AlertRulesColumnSettingsService, {
        getColumnSettings: jest.fn().mockReturnValue(of([])),
      }),
      mockProvider(AgGridLocalizationService, {
        lang: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
