import { Component, Input } from '@angular/core';

import { IotThing, Message } from '../../../core/store/reducers/thing/models';

@Component({
  selector: 'goldwind-cm-equipment',
  templateUrl: './cm-equipment.component.html',
  styleUrls: ['./cm-equipment.component.scss'],
})
export class CmEquipmentComponent {
  @Input() thing: IotThing;
  @Input() currentMessage: Message;
  @Input() socketStatus: number;
}
