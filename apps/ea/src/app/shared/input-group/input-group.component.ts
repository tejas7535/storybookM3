import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-input-group',
  standalone: true,
  imports: [MatIconModule, SharedTranslocoModule],
  templateUrl: './input-group.component.html',
})
export class InputGroupComponent {
  @Input() title!: string;
  @Input() svgIcon?: string;
  @Input() icon?: string;
  @Input() isMandatory = false;
}
