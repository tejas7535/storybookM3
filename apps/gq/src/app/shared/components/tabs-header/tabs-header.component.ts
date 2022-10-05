import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Tab } from './tab.model';

@Component({
  selector: 'gq-tabs-header',
  templateUrl: './tabs-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsHeaderComponent {
  @Input() tabs: Tab[];
}
