import { Component } from '@angular/core';

import { FooterLink } from '@schaeffler/footer-tailwind';

@Component({
  selector: 'mm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Mounting Manager';

  public footerLinks: FooterLink[] = [
    {
      link: 'https://Datenschutz',
      title: 'Datenschutz',
      external: true,
    },
    {
      link: 'https://Impressum',
      title: 'Impressum',
      external: true,
    },
  ];
}
