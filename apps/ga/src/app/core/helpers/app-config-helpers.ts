import { translate } from '@ngneat/transloco';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { detectAppDelivery } from '@ga/core/helpers/settings-helpers';
import { AppDelivery } from '@ga/shared/models';

/**
 * Returns app footer links
 * Defaults to empty array
 */
export const getAppFooterLinks = (): AppShellFooterLink[] => {
  const appDelivery = detectAppDelivery();

  if (appDelivery === AppDelivery.Embedded) {
    return [];
  }

  const footerLinks = [
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
  ];

  if (appDelivery === AppDelivery.Standalone) {
    footerLinks.push({
      link: `${LegalRoute}/${LegalPath.CookiePath}`,
      title: translate('legal.cookiePolicy'),
      external: false,
    });
  }

  return footerLinks;
};
