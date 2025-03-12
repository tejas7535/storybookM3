import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { AlertRulesService } from '../../../../../../feature/alert-rules/alert-rules.service';
import { SelectableOptionsService } from '../../../../../../shared/services/selectable-options.service';
import { AgGridLocalizationService } from './../../../../../../shared/services/ag-grid-localization.service';
import { Stub } from './../../../../../../shared/test/stub.class';
import { AlertRuleEditMultiModalComponent } from './alert-rule-edit-multi-modal.component';

describe('AlertRuleEditMultiModalComponent', () => {
  let component: AlertRuleEditMultiModalComponent;

  beforeEach(() => {
    component = Stub.get<AlertRuleEditMultiModalComponent>({
      component: AlertRuleEditMultiModalComponent,
      providers: [
        MockProvider(AlertRulesService, {
          getRuleTypeData: jest.fn().mockReturnValue(of([])),
        }),
        MockProvider(AgGridLocalizationService),
        MockProvider(SelectableOptionsService, {
          get: jest.fn().mockReturnValue({
            options: [],
            loading: false,
            loadingError: null,
          }),
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
