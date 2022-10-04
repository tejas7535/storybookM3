import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { ViewToggle } from '../../view-toggle.model';
@Component({
  selector: 'schaeffler-view-toggle',
  templateUrl: './view-toggle.component.html',
})
export class ViewToggleComponent {
  public active!: ViewToggle;
  public items: ViewToggle[] = [];

  @Input() public displayBorderBottom = false;

  @Input() public set views(value: ViewToggle[]) {
    if (value.length > 0) {
      this.active = value.find((el) => el.id === this.active?.id) || value[0];
      this.items = value;
    }
  }
  @Output() public selectionChange = new EventEmitter<ViewToggle>();

  public onViewSelect(event: MatButtonToggleChange) {
    this.active = event.value as ViewToggle;
    this.selectionChange.emit(this.active);
  }
}
