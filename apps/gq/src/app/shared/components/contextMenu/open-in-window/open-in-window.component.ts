import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuItem } from '@angular/material/menu';

import { openInNewWindowByUrl } from '../functions/context-menu-functions';

@Component({
  selector: 'gq-open-in-window',
  templateUrl: './open-in-window.component.html',
  standalone: false,
})
export class OpenInWindowComponent extends MatMenuItem {
  /**
   * if url given with navigate to url
   * */
  @Input() url: string;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  public openInWindow(): void {
    this.clicked.emit();
    if (this.url) {
      openInNewWindowByUrl(this.url);
    }
  }
}
