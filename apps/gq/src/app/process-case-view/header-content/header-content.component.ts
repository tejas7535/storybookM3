import { Component, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

import { Quotation } from '../../shared/models';

@Component({
  selector: 'gq-header-content',
  templateUrl: './header-content.component.html',
  styleUrls: ['./header-content.component.scss'],
})
export class HeaderContentComponent {
  @Input() quotation: Quotation;

  timedOutCloser: number;

  iconEnter(trigger: MatMenuTrigger): void {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  iconLeave(trigger: MatMenuTrigger): void {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 1500);
  }
}
