import { Component, Input } from '@angular/core';

import { translate } from '@jsverse/transloco';

@Component({
  selector: 'schaeffler-maintenance',
  templateUrl: './maintenance.component.html',
  standalone: false,
})
export class MaintenanceComponent {
  @Input() public title: string = translate('title');
  @Input() public subtitle: string = translate('subtitle');
}
