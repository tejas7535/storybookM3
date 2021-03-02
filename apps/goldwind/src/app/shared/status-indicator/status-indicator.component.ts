import { Component, Input } from '@angular/core';

import { ConnectionState } from '../../core/store/reducers/devices/models';

export interface Status {
  type: ConnectionState;
  text: string;
}

@Component({
  selector: 'goldwind-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
})
export class StatusIndicatorComponent {
  @Input() status: Status = {
    type: ConnectionState.connected,
    text: '',
  };

  isConnected(): boolean {
    if (this.status.type === ConnectionState.connected) {
      return true;
    }

    return false;
  }
}
