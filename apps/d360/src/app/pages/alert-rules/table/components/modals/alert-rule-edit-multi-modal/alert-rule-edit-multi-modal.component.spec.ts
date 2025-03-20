import { Stub } from './../../../../../../shared/test/stub.class';
import { AlertRuleEditMultiModalComponent } from './alert-rule-edit-multi-modal.component';

describe('AlertRuleEditMultiModalComponent', () => {
  let component: AlertRuleEditMultiModalComponent;

  beforeEach(() => {
    component = Stub.get<AlertRuleEditMultiModalComponent>({
      component: AlertRuleEditMultiModalComponent,
      providers: [Stub.getAlertRulesServiceProvider()],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have the correct title', () => {
    expect(component['title']).toBe('alert_rules.multi_modal.new_rules');
  });

  it('should have the correct modal mode', () => {
    expect(component['modalMode']).toBe('save');
  });

  it('should call the correct API method', () => {
    const alertRuleServiceSpy = jest.spyOn(
      component['alertRuleService'],
      'saveMultiAlertRules'
    );
    const data = [{ id: '1' } as any];
    const dryRun = false;

    component['apiCall'](data, dryRun);

    expect(alertRuleServiceSpy).toHaveBeenCalledWith(data, dryRun);
  });
});
