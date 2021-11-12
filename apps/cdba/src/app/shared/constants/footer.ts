import { AppShellFooterLink } from '@schaeffler/app-shell';

import { URL_FAQ, URL_S_CONNECT } from './urls';

export const FOOTER_LINKS: AppShellFooterLink[] = [
  {
    link: URL_FAQ,
    title: 'FAQs',
    external: true,
  },
  {
    link: URL_S_CONNECT,
    title: 'CDBA@SConnect',
    external: true,
  },
];
