import { Component, Input } from '@angular/core';

import { PictureCardAction } from './models/picture-card-action.model';

@Component({
  selector: 'schaeffler-picture-card',
  templateUrl: './picture-card.component.html',
  standalone: false,
})
export class PictureCardComponent {
  @Input() public img!: string;
  @Input() public title!: string;
  @Input() public toggleEnabled = false;
  @Input() public selected = false;
  @Input() public hideActionsOnActive = false;
  @Input() public actions!: PictureCardAction[];
  @Input() public isClickable = false;

  public active = false;

  public deactivate(): void {
    this.active = false;
  }

  public activate(): void {
    this.active = true;
  }

  public performAction(action: PictureCardAction): void {
    if (action.click) {
      action.click();
    }
  }

  public toggle(active: boolean, selected: boolean): void {
    this.active = active;
    this.selected = selected;
  }
}
