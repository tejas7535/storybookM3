import { Component } from '@angular/core';

import { FooterLink } from '@schaeffler/footer-tailwind';

@Component({
  selector: 'mm-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Mounting Manager';

  public footerLinks: FooterLink[] = [
    {
      link: '/assets/legal/data-privacy.html',
      title: 'Datenschutz',
      external: true,
    },
    {
      link: '/assets/legal/impressum.html',
      title: 'Impressum',
      external: true,
    },
  ];

  constructor() {}
}
