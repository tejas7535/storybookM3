import { AppRoutePath } from '@ga/app-route-path.enum';
import { UTM_PARAMS_DEFAULT } from '@ga/shared/constants';

import { HomepageCard } from '../models';

export const homepageCards: HomepageCard[] = [
  {
    mainTitle: 'calculator.title.main',
    subTitle: 'calculator.title.sub',
    imagePath: 'calculator.svg',
    routerPath: AppRoutePath.GreaseCalculationPath,
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'greaseCalculation',
  },
  {
    mainTitle: 'greases.title.main',
    subTitle: 'greases.title.sub',
    imagePath: 'greases.jpg',
    externalLink: 'greases.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'sources',
  },
  {
    mainTitle: 'lubricators.title.main',
    imagePath: 'lubricators.jpg',
    externalLink: 'lubricators.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'lubricatorsLink',
  },
  {
    mainTitle: 'maintenance.title.main',
    imagePath: 'maintenance.jpg',
    externalLink: 'maintenance.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'maintenanceLink',
  },
  {
    mainTitle: 'optime.title.main',
    imagePath: 'optime.jpg',
    externalLink: 'optime.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'optimeLink',
  },
  {
    mainTitle: 'catalog.title.main',
    imagePath: 'catalog.jpg',
    externalLink: 'catalog.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'catalogLink',
  },
  {
    mainTitle: 'contact.title.main',
    imagePath: 'contact.jpg',
    externalLink: 'contact.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'contactLink',
  },
  {
    mainTitle: 'faq.title.main',
    imagePath: 'faq.jpg',
    externalLink: 'faq.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'faqLink',
  },
];
