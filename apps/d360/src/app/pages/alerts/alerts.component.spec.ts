import { AlertStatus } from '../../feature/alerts/model';
import { Stub } from '../../shared/test/stub.class';
import { AlertsComponent } from './alerts.component';

describe('AlertsComponent', () => {
  let component: AlertsComponent;

  beforeEach(() => {
    component = Stub.get<AlertsComponent>({
      component: AlertsComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have selectedStatus initialized to ACTIVE', () => {
    expect(component['selectedStatus']()).toEqual(AlertStatus.ACTIVE);
  });

  it('should have selectedPriorities initialized with all three priorities', () => {
    expect(component['selectedPriorities']()).toHaveLength(3);
    expect(component['selectedPriorities']()).toContain(1);
    expect(component['selectedPriorities']()).toContain(2);
    expect(component['selectedPriorities']()).toContain(3);
  });

  it('should initialize statusControl with first alert status', () => {
    expect(component['statusControl'].value).toEqual(
      component['alertStatus'][0]
    );
  });

  describe('form controls', () => {
    it('should have a valid formGroup on initialization', () => {
      expect(component['formGroup'].valid).toBeTruthy();
    });

    it('should include statusControl in formGroup', () => {
      expect(component['formGroup'].contains('status')).toBeTruthy();
      expect(component['formGroup'].get('status')).toBe(
        component['statusControl']
      );
    });
  });

  describe('updateStatus method', () => {
    it('should not update selectedStatus when passed null', () => {
      // Set initial value
      component['updateStatus']({ id: AlertStatus.ACTIVE, text: 'Active' });

      // Try to update with null
      component['updateStatus'](null);

      // Should still be the initial value
      expect(component['selectedStatus']()).toEqual(AlertStatus.ACTIVE);
    });

    it('should not update selectedStatus when passed undefined', () => {
      // Set initial value
      component['updateStatus']({ id: AlertStatus.ACTIVE, text: 'Active' });

      // Try to update with undefined
      component['updateStatus'](undefined as any);

      // Should still be the initial value
      expect(component['selectedStatus']()).toEqual(AlertStatus.ACTIVE);
    });

    it('should update selectedStatus with correct AlertStatus value', () => {
      component['updateStatus']({
        id: AlertStatus.DEACTIVATED,
        text: 'Deactivated',
      });
      expect(component['selectedStatus']()).toEqual(AlertStatus.DEACTIVATED);
    });

    it('should update the signal when the alert status is changed', () => {
      component['updateStatus']({ id: 'COMPLETED', text: 'Completed' });
      expect(component['selectedStatus']()).toEqual(AlertStatus.COMPLETED);
    });
  });
});
