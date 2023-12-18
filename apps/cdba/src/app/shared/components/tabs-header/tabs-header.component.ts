import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Tab } from './tab.model';

@Component({
  selector: 'cdba-tabs-header',
  templateUrl: './tabs-header.component.html',
  styleUrls: ['./tabs-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsHeaderComponent {
  @Input() tabs: Tab[];

  /**
   * Improves performance of ngFor.
   */
  public trackByFn(index: number): number {
    return index;
  }
}
