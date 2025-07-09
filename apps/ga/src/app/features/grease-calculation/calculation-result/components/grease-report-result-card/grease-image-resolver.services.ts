import { Injectable } from '@angular/core';

const GREASE_IMAGE_MAPPINGS: Map<string, string> = new Map([
  [
    'Arcanol MOTION 2',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A7D4_d.png',
  ],
  ['Arcanol MULTI3', 'https://cdn.schaeffler-ecommerce.com/cdn/0016A80C_d.png'],
  [
    'Arcanol MULTITOP',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A76E_d.png',
  ],
  [
    'Arcanol LOAD150',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A791_d.png',
  ],
  [
    'Arcanol LOAD400',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A7AD_d.png',
  ],
  ['Arcanol MULTI2', 'https://cdn.schaeffler-ecommerce.com/cdn/0016A804_d.png'],
  [
    'Arcanol SPEED 2,6',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A81A_d.png',
  ],
  [
    'Arcanol TEMP110',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A827_d.png',
  ],
  [
    'Arcanol Clean M',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A776_d.png',
  ],
  ['Arcanol VIB3', 'https://cdn.schaeffler-ecommerce.com/cdn/0016A85F_d.png'],
  ['Arcanol TEMP90', 'https://cdn.schaeffler-ecommerce.com/cdn/0016A853_d.png'],
  [
    'Arcanol LOAD220',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A7A0_d.png',
  ],
  [
    'Arcanol TEMP200',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A846_d.png',
  ],
  [
    'Arcanol LOAD460',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A7BD_d.png',
  ],
  [
    'Arcanol TEMP120',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A835_d.png',
  ],
  [
    'Arcanol LOAD1000',
    'https://cdn.schaeffler-ecommerce.com/cdn/0016A03E_d.png',
  ],
  ['Arcanol FOOD2', 'https://cdn.schaeffler-ecommerce.com/cdn/0016A782_d.png'],
]);

const FALLBKACK_IMAGE = '/assets/images/placeholder.png';

@Injectable({ providedIn: 'root' })
export class GreaseImageResolver {
  getImageUrl(designation: string): string {
    return GREASE_IMAGE_MAPPINGS.get(designation) || FALLBKACK_IMAGE;
  }
}
