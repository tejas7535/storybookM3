import { Component } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { translate } from '@ngneat/transloco';

import { FooterLink } from '@schaeffler/footer';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

@Component({
  selector: 'ga-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Grease App';
  metaTags: MetaDefinition[] = [
    { name: 'title', content: translate('meta.title') },
    { name: 'description', content: translate('meta.description') },
    // Open Graph / Facebook
    { name: 'og:title', content: translate('meta.title') },
    { name: 'og:description', content: translate('meta.description') },
    // Twitter
    { name: 'twitter:title', content: translate('meta.title') },
    { name: 'twitter:description', content: translate('meta.description') },
  ];

  public constructor(private readonly meta: Meta) {
    this.meta.addTags(this.metaTags);
  }

  public footerLinks: FooterLink[] = [
    {
      link: `${LegalRoute}/${LegalPath.ImprintPath}`,
      title: translate('legal.imprint'),
      external: false,
    },
    {
      link: `${LegalRoute}/${LegalPath.DataprivacyPath}`,
      title: translate('legal.dataPrivacy'),
      external: false,
    },
    {
      link: `${LegalRoute}/${LegalPath.TermsPath}`,
      title: translate('legal.termsOfUse'),
      external: false,
    },
    {
      link: `${LegalRoute}/${LegalPath.CookiePath}`,
      title: translate('legal.cookiePolicy'),
      external: false,
    },
  ];
}
