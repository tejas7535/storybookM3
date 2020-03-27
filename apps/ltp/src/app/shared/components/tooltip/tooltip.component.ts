import { Component, Input } from '@angular/core';

import { Icon } from '@schaeffler/shared/icons';

@Component({
  selector: 'ltp-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @Input() content: string;
  @Input() color: string;
  @Input() manualcolor: string;
  @Input() icon: string;
  @Input() materialIcon = false;

  getIcon(icon: string): Icon {
    return new Icon(icon, this.materialIcon);
  }
}
