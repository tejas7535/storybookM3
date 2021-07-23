import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { Icon } from '@schaeffler/icons';

import { SpeedDialFabItem } from './speed-dial-fab-item';
import { speedDialFabAnimations } from './speed-dial-fab.animations';

@Component({
  selector: 'schaeffler-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss'],
  animations: speedDialFabAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpeedDialFabComponent implements OnChanges {
  @Input() public primaryButton: SpeedDialFabItem = {
    key: 'add',
    icon: new Icon('icon-plus', false),
    color: 'primary',
    label: true,
    title: 'Edit',
  };

  public primaryButtonOpen: SpeedDialFabItem = {
    key: 'cancel',
    icon: new Icon('icon-cross', false),
    color: 'primary',
    label: true,
    title: 'Cancel',
  };

  @Input() public secondaryButtons: SpeedDialFabItem[];
  @Input() public open = false;
  @Input() public disabled: boolean[] = [];

  @Output() public readonly clicked: EventEmitter<string> = new EventEmitter();

  public fabButtons: SpeedDialFabItem[] = [];

  /**
   * Fill or clear fabButtons expected by open-state to trigger animation
   */
  public ngOnChanges(change: SimpleChanges): void {
    // eslint-disable-next-line no-prototype-builtins
    if (change.hasOwnProperty('open')) {
      this.fabButtons = this.open ? this.secondaryButtons : [];
    }
  }

  /**
   * Emits the clicked event
   */
  public clickItem(key: string, event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }

    this.clicked.emit(key);
  }

  /**
   * Helps Angular to track array
   */
  public trackByFn(index: number): number {
    return index;
  }
}
