import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-info-icon',
  templateUrl: './info-icon.component.html',
  standalone: false,
})
export class InfoIconComponent {
  @Input() showHelpIcon: boolean;
  @Input() displaySmall: boolean;
  @Input() text: string;
}
