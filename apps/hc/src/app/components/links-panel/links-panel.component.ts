import { Component, Input } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LinkGroup } from '../learn-more/models';

@Component({
  selector: 'hc-links-panel',
  templateUrl: './links-panel.component.html',
  standalone: true,
  imports: [SharedTranslocoModule],
})
export class LinksPanelComponent {
  @Input() public linkGroups: LinkGroup[] = [];
}
