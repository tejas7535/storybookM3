import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-input-group',
  standalone: true,
  imports: [CommonModule, MatIconModule, SharedTranslocoModule],
  templateUrl: './input-group.component.html',
})
export class InputGroupComponent {
  @Input() title!: string;
  @Input() svgIcon?: string;
  @Input() icon?: string;
  @Input() isMandatory = false;
}
