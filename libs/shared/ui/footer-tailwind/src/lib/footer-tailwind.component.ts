import { Component, Input } from '@angular/core';

import { FooterLink } from './footer-link.model';

@Component({
  selector: 'schaeffler-footer-tailwind',
  templateUrl: './footer-tailwind.component.html',
  styleUrls: ['./footer-tailwind.component.scss'],
})
export class FooterTailwindComponent {
  @Input() public footerLinks: FooterLink[] = [];
  @Input() public appVersion?: string;

  public trackByFn(index: number): number {
    return index;
  }
}
