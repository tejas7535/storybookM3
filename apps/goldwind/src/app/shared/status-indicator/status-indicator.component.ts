import { Component, Input } from '@angular/core';

export enum StatusType {
  ok = 'OK',
  error = 'ER',
}

export interface Status {
  type: StatusType;
  text: string;
  notifications: string[];
}

@Component({
  selector: 'goldwind-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
})
export class StatusIndicatorComponent {
  @Input() status: Status = {
    type: StatusType.ok,
    text: '',
    notifications: [],
  };
  statusType = StatusType;
}
