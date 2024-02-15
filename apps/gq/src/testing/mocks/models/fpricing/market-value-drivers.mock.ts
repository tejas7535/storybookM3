import { ProductType } from '@gq/shared/models';
/**
 * ALL OF the Mock refer to each other. All of them have the same "BASIS" just differently MAPPED
 */
export const MARKET_VALUE_DRIVERS_BE_RESPONSE_MOCK = [
  {
    questionId: 1,
    selectedOptionId: 1,
    productType: 'CRB',
    options: [
      {
        optionId: 1,
        surcharge: 10,
      },
      {
        optionId: 2,
        surcharge: 20,
      },
      {
        optionId: 3,
        surcharge: 30,
      },
      {
        optionId: 4,
        surcharge: 40,
      },
    ],
  },
  {
    questionId: 2,
    selectedOptionId: 2,
    productType: 'CRB',
    options: [
      {
        optionId: 1,
        surcharge: 30,
      },
      {
        optionId: 2,
        surcharge: 40,
      },
      {
        optionId: 3,
        surcharge: 50,
      },
      {
        optionId: 4,
        surcharge: 60,
      },
    ],
  },
  {
    questionId: 3,
    selectedOptionId: 3,
    productType: 'CRB',
    options: [
      {
        optionId: 1,
        surcharge: 20,
      },
      {
        optionId: 2,
        surcharge: 30,
      },
      {
        optionId: 3,
        surcharge: 40,
      },
      {
        optionId: 4,
        surcharge: 50,
      },
    ],
  },
  {
    questionId: 4,
    selectedOptionId: 4,
    productType: 'CRB',
    options: [
      {
        optionId: 1,
        surcharge: 30,
      },
      {
        optionId: 2,
        surcharge: 40,
      },
      {
        optionId: 3,
        surcharge: 50,
      },
      {
        optionId: 4,
        surcharge: 60,
      },
    ],
  },
  {
    questionId: 5,
    selectedOptionId: 3,
    productType: 'CRB',
    options: [
      {
        optionId: 1,
        surcharge: 10,
      },
      {
        optionId: 2,
        surcharge: 20,
      },
      {
        optionId: 3,
        surcharge: 30,
      },
    ],
  },
];

export const MARKET_VALUE_DRIVERS_MOCK =
  MARKET_VALUE_DRIVERS_BE_RESPONSE_MOCK.map((item) => ({
    ...item,
    productType: ProductType.CRB,
  }));

export const MARKET_VALUE_DRIVERS_FOR_DISPLAY_MOCK = [
  {
    questionId: 1,
    options: [
      { optionId: 1, selected: true },
      { optionId: 2, selected: false },
      { optionId: 3, selected: false },
      { optionId: 4, selected: false },
    ],
  },
  {
    questionId: 2,
    options: [
      { optionId: 1, selected: false },
      { optionId: 2, selected: true },
      { optionId: 3, selected: false },
      { optionId: 4, selected: false },
    ],
  },
  {
    questionId: 3,
    options: [
      { optionId: 1, selected: false },
      { optionId: 2, selected: false },
      { optionId: 3, selected: true },
      { optionId: 4, selected: false },
    ],
  },
  {
    questionId: 4,
    options: [
      { optionId: 1, selected: false },
      { optionId: 2, selected: false },
      { optionId: 3, selected: false },
      { optionId: 4, selected: true },
    ],
  },
  {
    questionId: 5,
    options: [
      { optionId: 1, selected: false },
      { optionId: 2, selected: false },
      { optionId: 3, selected: true },
    ],
  },
];
