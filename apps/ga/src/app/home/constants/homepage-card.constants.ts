import { AppRoutePath } from '@ga/app-route-path.enum';
import { UTM_PARAMS_DEFAULT } from '@ga/shared/constants';

import { HomepageCard } from '../models';

export const homepageCards: HomepageCard[] = [
  {
    mainTitle: 'calculator.title.main',
    subTitle: 'calculator.title.sub',
    templateId: 'calculatorLogo',
    routerPath: AppRoutePath.GreaseCalculationPath,
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'greaseCalculation',
  },
  {
    mainTitle: 'greases.title.main',
    subTitle: 'greases.title.sub',
    templateId: 'imageCard',
    imagePath: 'greases.jpg',
    externalLink: 'greases.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'sources',
  },
  {
    mainTitle: 'lubricators.title.main',
    templateId: 'imageCard',
    imagePath: 'lubricators.jpg',
    externalLink: 'lubricators.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'lubricatorsLink',
  },
  {
    mainTitle: 'maintenance.title.main',
    subTitle: 'maintenance.title.sub',
    templateId: 'imageCard',
    imagePath: 'maintenance.jpg',
    externalLink: 'maintenance.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'maintenanceLink',
  },
  {
    mainTitle: 'optime.title.main',
    templateId: 'imageCard',
    imagePath: 'optime.jpg',
    externalLink: 'optime.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'optimeLink',
  },
  {
    mainTitle: 'catalog.title.main',
    templateId: 'imageCard',
    imagePath: 'catalog.jpg',
    externalLink: 'catalog.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'catalogLink',
  },
  {
    mainTitle: 'contact.title.main',
    templateId: 'imageCard',
    imagePath: 'contact.jpg',
    externalLink: 'contact.externalLink',
    trackingId: 'contactLink',
  },
  {
    mainTitle: 'faq.title.main',
    templateId: 'imageCard',
    imagePath: 'faq.jpg',
    externalLink: 'faq.externalLink',
    utmParameters: UTM_PARAMS_DEFAULT,
    trackingId: 'faqLink',
  },
];
