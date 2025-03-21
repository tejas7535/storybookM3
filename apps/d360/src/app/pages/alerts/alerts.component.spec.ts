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

  it('should update the signal when the alert status is changed', () => {
    component['updateStatus']({ id: 'COMPLETED', text: 'Completed' });
    expect(component['selectedStatus']()).toEqual(AlertStatus.COMPLETED);
  });
});
