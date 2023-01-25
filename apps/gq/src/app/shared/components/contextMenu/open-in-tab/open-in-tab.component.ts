import { Component, Input } from '@angular/core';

import { openInNewTabByUrl } from '../functions/context-menu-functions';

@Component({
  selector: 'gq-open-in-tab',
  templateUrl: './open-in-tab.component.html',
})
export class OpenInTabComponent {
  @Input() url: string;
  public openInTab(): void {
    openInNewTabByUrl(this.url);
  }
}
