import { Component, Input } from '@angular/core';

import { IotThing } from '../../../core/store/reducers/bearing/models';
import { Message } from '../../../core/store/reducers/condition-monitoring/models';

@Component({
  selector: 'goldwind-cm-equipment',
  templateUrl: './cm-equipment.component.html',
  styleUrls: ['./cm-equipment.component.scss'],
})
export class CmEquipmentComponent {
  @Input() bearing: IotThing;
  @Input() currentMessage: Message;
  @Input() socketStatus: number;
}
