import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-info-icon',
  templateUrl: './info-icon.component.html',
})
export class InfoIconComponent {
  @Input() showHelpIcon: boolean;
  @Input() text: string;
}
