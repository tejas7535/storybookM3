import { Component, Input } from '@angular/core';

@Component({
  selector: 'schaeffler-picture-card-action',
  templateUrl: './picture-card-action.component.html',
})
export class PictureCardActionComponent {
  @Input() text!: string;
  @Input() disabled!: boolean;
  @Input() click!: void;
  @Input() toggleAction = false;
}
