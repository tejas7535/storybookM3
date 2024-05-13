import { Component, Input } from '@angular/core';

import { LinkGroups } from '@hc/models/resource-links.model';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'hc-links-panel',
  templateUrl: './links-panel.component.html',
  standalone: true,
  imports: [SharedTranslocoModule],
})
export class LinksPanelComponent {
  @Input() public linkGroups: LinkGroups = [];
}
