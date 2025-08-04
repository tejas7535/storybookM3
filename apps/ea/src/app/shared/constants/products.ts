import { CatalogServiceProductClass } from '@ea/core/services/catalog.service.interface';

// unsealed bearing, has friction calculation, has relubrication interval
// export const DEFAULT_BEARING_DESIGNATION = '2212-TVH';
// sealed bearing, has no friction calculation, has grease service life
export const DEFAULT_BEARING_DESIGNATION = '6210-C-2HRS';

export const SLEWING_BEARING_TYPE = 'IDO_SLEWING_BEARING';
export const CATALOG_BEARING_TYPE = 'IDO_CATALOGUE_BEARING';

export const SUPPORTED_PRODUCT_CLASSES: CatalogServiceProductClass[] = [
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
];
