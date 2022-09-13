import { QuickFilter } from '@mac/feature/materials-supplier-database/models';

export const StaticQuickFilters: QuickFilter[] = [
  {
    title: 'default',
    filter: {},
    columns: [
      'materialStandardMaterialName',
      'materialStandardStandardDocument',
      'manufacturerSupplierName',
      'manufacturerSupplierPlant',
      'castingMode',
      'castingDiameter',
      'maxDimension',
      'rating',
      'releaseRestrictions',
      'productCategoryText',
    ],
    custom: false,
  },
  {
    title: 'rating',
    filter: {
      rating: {
        values: ['RSI', 'RSII', 'RSIII'],
        filterType: 'set',
      },
    },
    columns: [
      'materialStandardMaterialName',
      'materialStandardStandardDocument',
      'manufacturerSupplierName',
      'manufacturerSupplierPlant',
      'castingMode',
      'castingDiameter',
      'maxDimension',
      'rating',
      'releaseRestrictions',
      'productCategoryText',
    ],
    custom: false,
  },
  {
    title: 'co2',
    filter: {
      co2PerTon: {
        filterType: 'number',
        type: 'greaterThan',
        filter: 0,
      },
    },
    columns: [
      'materialStandardMaterialName',
      'materialStandardStandardDocument',
      'manufacturerSupplierName',
      'manufacturerSupplierPlant',
      'castingMode',
      'castingDiameter',
      'steelMakingProcess',
      'co2PerTon',
      'productCategoryText',
    ],
    custom: false,
  },
];
