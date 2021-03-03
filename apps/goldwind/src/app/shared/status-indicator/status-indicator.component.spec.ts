import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ConnectionState } from '../../core/store/reducers/devices/models';
import { StatusIndicatorComponent } from './status-indicator.component';

describe('StatusIndicatorComponent', () => {
  let component: StatusIndicatorComponent;
  let spectator: Spectator<StatusIndicatorComponent>;

  const createComponent = createComponentFactory({
    component: StatusIndicatorComponent,
    imports: [MatIconModule],
    declarations: [StatusIndicatorComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isConnected', () => {
    test('should return correct value', () => {
      expect(component.isConnected()).toBe(false);

      component.connectionState = ConnectionState.connected;
      expect(component.isConnected()).toBe(true);
    });
  });
});
