import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SensorComponent } from './sensor.component';

describe('DateRangeComponent', () => {
  let component: SensorComponent;
  let spectator: Spectator<SensorComponent>;

  const createComponent = createComponentFactory({
    component: SensorComponent,
    imports: [MatRadioModule],
    declarations: [SensorComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleSensor', () => {
    it('should toggle the sensor and call event emit', () => {
      component['sensorToggle'].emit = jest.fn();

      component.sensor = true;

      component.toggleSensor({ value: 1 });
      expect(component.sensor).toBe(false);

      expect(component['sensorToggle'].emit).toHaveBeenCalledTimes(1);
      expect(component['sensorToggle'].emit).toHaveBeenCalledWith({
        sensor: false,
        type: undefined,
        value: 1,
      });
    });
  });
});
