import { Component, Input } from '@angular/core';

import { ConnectionState } from '../../core/store/reducers/devices/models';

@Component({
  selector: 'goldwind-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss'],
})
export class StatusIndicatorComponent {
  @Input() connectionState: ConnectionState = ConnectionState.disconnected;

  isConnected(): boolean {
    if (this.connectionState === ConnectionState.connected) {
      return true;
    }

    return false;
  }
}
