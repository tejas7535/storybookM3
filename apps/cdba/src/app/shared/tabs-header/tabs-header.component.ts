import { Component, Input } from '@angular/core';

import { Tab } from '../interfaces';

@Component({
  selector: 'cdba-tabs-header',
  templateUrl: './tabs-header.component.html',
  styleUrls: ['./tabs-header.component.scss'],
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
