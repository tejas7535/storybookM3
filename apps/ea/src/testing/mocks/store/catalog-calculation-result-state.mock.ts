import { CatalogCalculationResultState } from '@ea/core/store/models';

export const CATALOG_CALCULATION_RESULT_STATE_MOCK: CatalogCalculationResultState =
  {
    isLoading: false,
    basicFrequencies: {
      rows: [],
      title: 'Catalog Calculation Result',
    },
    result: {
      lh10: {
        unit: 'h',
        value: '123',
      },
      reportInputSuborinates: {
        inputSubordinates: [
          {
            hasNestedStructure: true,
            title: 'some title',
          },
        ],
      },
      reportMessages: {
        messages: [
          {
            title: 'Errors',
          },
          {
            title: 'Warnings',
          },
        ],
      },
    },
  };
