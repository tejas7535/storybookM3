import { Component } from '@angular/core';

import { translate } from '@ngneat/transloco';

import { FooterLink } from '@schaeffler/footer';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

@Component({
  selector: 'ga-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Grease App';

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
