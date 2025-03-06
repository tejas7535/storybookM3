import { Component, Input } from '@angular/core';

@Component({
  selector: 'schaeffler-picture-card-action',
  templateUrl: './picture-card-action.component.html',
  standalone: false,
})
export class PictureCardActionComponent {
  @Input() public text!: string;
  @Input() public disabled!: boolean;
  @Input() public click!: (event?: any) => void;
  @Input() public toggleAction = false;
  @Input() public selectAction = false;
  @Input() public selected = false;
}
