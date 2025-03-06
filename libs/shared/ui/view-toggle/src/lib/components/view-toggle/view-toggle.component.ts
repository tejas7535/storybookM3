import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { ViewToggle } from '../../view-toggle.model';
import { ViewToggleStatus } from '../../view-toggle-status.enum';
@Component({
  selector: 'schaeffler-view-toggle',
  templateUrl: './view-toggle.component.html',
  standalone: false,
})
export class ViewToggleComponent {
  @Input() public displayBorderBottom = false;

  @Output() public iconClicked = new EventEmitter<{
    viewId: number;
    iconName: string;
  }>();

  @Output() public selectionChange = new EventEmitter<ViewToggle>();

  @Output() public viewToggleDoubleClicked = new EventEmitter<number>();

  public active!: ViewToggle;
  public items: ViewToggle[] = [];

  public viewToggleStatus = ViewToggleStatus;

  @Input() public set views(value: ViewToggle[]) {
    if (value.length > 0) {
      this.active = value.find((el) => el.active) || value[0];
      this.items = value;
    }
  }

  public onViewSelect(event: MatButtonToggleChange) {
    this.selectionChange.emit(event.value);
  }

  public onIconClicked(event: MouseEvent, viewId: number, iconName: string) {
    event.stopPropagation();
    event.preventDefault();

    this.iconClicked.emit({ viewId, iconName });
  }

  public onDoubleClick(event: MouseEvent, viewId: number) {
    event.stopPropagation();
    event.preventDefault();

    this.viewToggleDoubleClicked.emit(viewId);
  }
}
