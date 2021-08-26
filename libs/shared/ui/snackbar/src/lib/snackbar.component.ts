import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { SnackBarData } from './snackbar-data.model';

const iconMap: Map<string, string> = new Map([
  ['success', 'check_circle'],
  ['error', 'warning'],
  ['warning', 'warning'],
  ['information', 'info'],
]);

@Component({
  selector: 'schaeffler-snackbar',
  styleUrls: ['snackbar.component.scss'],
  templateUrl: 'snackbar.component.html',
})
export class SnackBarComponent {
  public readonly action: EventEmitter<void> = new EventEmitter();

  public icon = 'info';

  public constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) {
    this.icon = iconMap.get(data.type) ?? this.icon;
  }

  /**
   * emits the ation event
   */
  public clickActionButton(): void {
    this.action.emit();
  }
}
