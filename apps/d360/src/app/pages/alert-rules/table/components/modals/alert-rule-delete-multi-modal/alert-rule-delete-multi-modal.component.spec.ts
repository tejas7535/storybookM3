import { Stub } from './../../../../../../shared/test/stub.class';
import { AlertRuleDeleteMultiModalComponent } from './alert-rule-delete-multi-modal.component';

describe('AlertRuleDeleteMultiModalComponent', () => {
  let component: AlertRuleDeleteMultiModalComponent;

  beforeEach(() => {
    component = Stub.get<AlertRuleDeleteMultiModalComponent>({
      component: AlertRuleDeleteMultiModalComponent,
      providers: [Stub.getAlertRulesServiceProvider()],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component['title']).toBe('alert_rules.multi_modal.delete_rules');
  });

  it('should have the correct modal mode', () => {
    expect(component['modalMode']).toBe('delete');
  });

  it('should call the correct API method', () => {
    const alertRuleServiceSpy = jest.spyOn(
      component['alertRuleService'],
      'deleteMultiAlterRules'
    );
    const data = [{ id: '1' } as any];
    const dryRun = false;

    component['apiCall'](data, dryRun);

    expect(alertRuleServiceSpy).toHaveBeenCalledWith(data, dryRun);
  });
});
