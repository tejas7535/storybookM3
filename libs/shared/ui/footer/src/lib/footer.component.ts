import { Component, Input } from '@angular/core';

import { FooterLink } from './footer-link.model';

@Component({
  selector: 'schaeffler-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() public footerLinks: FooterLink[] = [];
  @Input() public appVersion?: string;

  public trackByFn(index: number): number {
    return index;
  }
}
