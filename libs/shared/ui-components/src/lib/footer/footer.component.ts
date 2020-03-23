import { Component, Input } from '@angular/core';
import { FooterLink } from './footer-link.model';

import { version } from '../../../../../../package.json';
/**
 * Root Component for Footer
 *
 */
@Component({
  selector: 'schaeffler-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  @Input() public footerLinks: FooterLink[];

  public version = version;

  public trackByFn(index: number): number {
    return index;
  }
}
