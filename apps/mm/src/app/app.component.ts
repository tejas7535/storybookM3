import { Component, OnInit } from '@angular/core';

import { FooterLink } from '@schaeffler/footer-tailwind';

@Component({
  selector: 'mm-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public title = 'Mounting Manager';
  public embedded = false;

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

  public ngOnInit(): void {
    this.checkIframe();
  }

  public checkIframe(): void {
    if (window.self !== window.top) {
      this.embedded = true;
    }
  }
}
