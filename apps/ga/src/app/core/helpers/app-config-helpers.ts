import { translate } from '@jsverse/transloco';

import { AppShellFooterLink } from '@schaeffler/app-shell';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';

import { AppDelivery } from '@ga/shared/models';

import { OneTrustMobileService } from '../services/tracking/one-trust-mobile.service';
import { detectAppDelivery } from './settings-helpers';

/**
 * Returns app footer links
 * Defaults to empty array
 */
export const getAppFooterLinks = (
  oneTrustMobileService: OneTrustMobileService
): AppShellFooterLink[] => {
  const appDelivery = detectAppDelivery();

  if (appDelivery === AppDelivery.Embedded) {
    return [];
  }

  const footerLinks: AppShellFooterLink[] = [
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

  if (appDelivery === AppDelivery.Native) {
    footerLinks.push({
      link: undefined,
      title: translate('legal.cookiePolicy'),
      external: false,
      onClick: ($event: MouseEvent) => {
        $event.preventDefault();
        oneTrustMobileService.showPreferenceCenterUI();
      },
    });
  }

  return footerLinks;
};
