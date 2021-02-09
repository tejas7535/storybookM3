import { Component, Input } from '@angular/core';

import { PictureCardAction } from './models/picture-card-action.model';

@Component({
  selector: 'schaeffler-picture-card',
  templateUrl: './picture-card.component.html',
  styleUrls: ['./picture-card.component.scss'],
})
export class PictureCardComponent {
  @Input() img!: string;
  @Input() title!: string;
  @Input() toggleEnabled = false;
  @Input() hideActionsOnActive = false;
  @Input() actions!: PictureCardAction[];

  active = false;

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
