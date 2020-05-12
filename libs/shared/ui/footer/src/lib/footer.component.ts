import { Component, Input } from '@angular/core';

import { FooterLink } from './footer-link.model';
import { VERSION } from './version';

@Component({
  selector: 'schaeffler-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() public footerLinks: FooterLink[];

  public version = VERSION;

  public trackByFn(index: number): number {
    return index;
  }
}
