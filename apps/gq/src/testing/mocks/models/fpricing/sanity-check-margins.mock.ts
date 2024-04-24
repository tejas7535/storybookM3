import { TableItem } from '@gq/f-pricing/pricing-assistant-modal/models/table-item';
import { SanityCheckMargins } from '@gq/shared/models/f-pricing/sanity-check-margins.interface';

export const SANITY_CHECK_MARGINS_MOCK: SanityCheckMargins = {
  maxMargin: 0.8,
  minMargin: 0.2,
  productHierarchy: 'productHierarchy',
  sectorManagement: 'sectorManagement',
};

export const SANITY_CHECKS_FOR_DISPLAY: TableItem[] = [
  {
    id: 1,
    description: 'priceRecommendationBefore',
    value: 100,
  },
  {
    id: 2,
    description: 'cost',
    value: 2,
  },
  {
    id: 3,
    description: 'lowerThreshold',
    value: 200,
  },
  {
    id: 4,
    description: 'lastCustomerPrice',
    value: 123,
  },
  {
    id: 5,
    description: 'upperThreshold',
    value: 400,
  },
  {
    id: 6,
    description: 'priceRecommendationAfter',
    value: 102,
  },
];

export const SANITY_CHECKS_FOR_DISPLAY_AFTER_MAPPING: TableItem[] = [
  { ...SANITY_CHECKS_FOR_DISPLAY[0], value: 'mappedValue' },
  { ...SANITY_CHECKS_FOR_DISPLAY[1], value: 'mappedValue' },
  { ...SANITY_CHECKS_FOR_DISPLAY[2], value: 'mappedValue' },
  { ...SANITY_CHECKS_FOR_DISPLAY[3], value: 'mappedValue' },
  { ...SANITY_CHECKS_FOR_DISPLAY[4], value: 'mappedValue' },
  { ...SANITY_CHECKS_FOR_DISPLAY[5], value: 'mappedValue' },
];
