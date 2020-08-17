import { Component, Input } from '@angular/core';

import { Message } from '../../../core/store/reducers/condition-monitoring/models';

@Component({
  selector: 'goldwind-center-load',
  templateUrl: './center-load.component.html',
  styleUrls: ['./center-load.component.scss'],
})
export class CenterLoadComponent {
  @Input() currentMessage: Message;
  @Input() socketStatus: number;
}
