import { CatalogServiceProductClass } from '@ea/core/services/catalog.service.interface';

// unsealed bearing, has friction calculation, has relubrication interval
// export const DEFAULT_BEARING_DESIGNATION = '2212-TVH';
// sealed bearing, has no friction calculation, has grease service life
export const DEFAULT_BEARING_DESIGNATION = '6210-C-2HRS';

export const SUPPORTED_PRODUCT_CLASSES: CatalogServiceProductClass[] = [
  'IDO_CATALOGUE_BEARING',
];
