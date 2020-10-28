import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Sensor } from './sensor.enum';

@Component({
  selector: 'goldwind-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss'],
})
export class SensorComponent {
  @Input() type: Sensor;
  @Input() sensor: boolean;
  @Output() readonly sensorToggle: EventEmitter<{
    sensor: boolean;
  }> = new EventEmitter();

  toggleSensor(): void {
    this.sensor = !this.sensor;
    this.sensorToggle.emit({ sensor: this.sensor });
  }
}
