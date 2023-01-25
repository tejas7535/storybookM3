import { Component, Input } from '@angular/core';

import { openInNewWindowByUrl } from '../functions/context-menu-functions';

@Component({
  selector: 'gq-open-in-window',
  templateUrl: './open-in-window.component.html',
})
export class OpenInWindowComponent {
  @Input() url: string;

  public openInWindow(): void {
    openInNewWindowByUrl(this.url);
  }
}
