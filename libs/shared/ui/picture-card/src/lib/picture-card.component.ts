import { Component, Input } from '@angular/core';

import { PictureCardAction } from './models/picture-card-action.model';

@Component({
  selector: 'schaeffler-picture-card',
  templateUrl: './picture-card.component.html',
  styleUrls: ['./picture-card.component.scss'],
})
export class PictureCardComponent {
  @Input() public img!: string;
  @Input() public title!: string;
  @Input() public toggleEnabled = false;
  @Input() public hideActionsOnActive = false;
  @Input() public actions!: PictureCardAction[];

  public active = false;

  public deactivate(): void {
    this.active = false;
  }

  public activate(): void {
    this.active = true;
  }

  public toggle(): void {
    this.active = !this.active;
  }

  public trackByFn(index: number): number {
    return index;
  }
}
