import { Component, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'gq-info-icon',
  templateUrl: './info-icon.component.html',
})
export class InfoIconComponent {
  @Input() showHelpIcon: boolean;
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
