import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ConnectionState } from '../../core/store/reducers/devices/models';
import { StatusIndicatorComponent } from './status-indicator.component';

describe('StatusIndicatorComponent', () => {
  let component: StatusIndicatorComponent;
  let spectator: Spectator<StatusIndicatorComponent>;

  const createComponent = createComponentFactory({
    component: StatusIndicatorComponent,
    imports: [MatIconModule, MatIconTestingModule],
    declarations: [StatusIndicatorComponent],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isConnected', () => {
    it('should return correct value', () => {
      expect(component.isConnected()).toBe(false);

      component.connectionState = ConnectionState.connected;
      expect(component.isConnected()).toBe(true);
    });
  });
});
