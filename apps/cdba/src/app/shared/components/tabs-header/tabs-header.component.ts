import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Tab } from './tab.model';

@Component({
  selector: 'cdba-tabs-header',
  templateUrl: './tabs-header.component.html',
  styleUrls: ['./tabs-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TabsHeaderComponent {
  @Input() tabs: Tab[];
}
