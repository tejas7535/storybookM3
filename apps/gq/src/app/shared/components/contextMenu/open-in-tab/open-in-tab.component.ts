import { Component, EventEmitter, Input, Output } from '@angular/core';

import { openInNewTabByUrl } from '../functions/context-menu-functions';

@Component({
  selector: 'gq-open-in-tab',
  templateUrl: './open-in-tab.component.html',
})
export class OpenInTabComponent {
  /**
   * if url given with navigate to url
   * */
  @Input() url: string;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  public openInTab(): void {
    this.clicked.emit();
    if (this.url) {
      openInNewTabByUrl(this.url);
    }
  }
}
