import { Component, Input } from '@angular/core';

import { Icon } from './icon.model';

@Component({
  selector: 'schaeffler-icon',
  templateUrl: './icon.component.html'
})
export class IconComponent {
  @Input() public icon: Icon;
  @Input() public fontSize = '24px';
}
