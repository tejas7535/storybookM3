import { ProductType } from '@gq/shared/models';
import { MarketValueDriver } from '@gq/shared/models/f-pricing';

/**
 * ALL OF the Mock refer to each other. All of them have the same "BASIS" just differently MAPPED
 */
export const MARKET_VALUE_DRIVERS_BE_RESPONSE_MOCK: MarketValueDriver[] = [
  {
    questionId: 1,
    selectedOptionId: 1,
    productType: ProductType.CRB,
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
    productType: ProductType.CRB,
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
    productType: ProductType.CRB,
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
    productType: ProductType.CRB,
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
    productType: ProductType.CRB,
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
      { optionId: 1, selected: true, surcharge: 10 },
      { optionId: 2, selected: false, surcharge: 20 },
      { optionId: 3, selected: false, surcharge: 30 },
      { optionId: 4, selected: false, surcharge: 40 },
    ],
  },
  {
    questionId: 2,
    options: [
      { optionId: 1, selected: false, surcharge: 30 },
      { optionId: 2, selected: true, surcharge: 40 },
      { optionId: 3, selected: false, surcharge: 50 },
      { optionId: 4, selected: false, surcharge: 60 },
    ],
  },
  {
    questionId: 3,
    options: [
      { optionId: 1, selected: false, surcharge: 20 },
      { optionId: 2, selected: false, surcharge: 30 },
      { optionId: 3, selected: true, surcharge: 40 },
      { optionId: 4, selected: false, surcharge: 50 },
    ],
  },
  {
    questionId: 4,
    options: [
      { optionId: 1, selected: false, surcharge: 30 },
      { optionId: 2, selected: false, surcharge: 40 },
      { optionId: 3, selected: false, surcharge: 50 },
      { optionId: 4, selected: true, surcharge: 60 },
    ],
  },
  {
    questionId: 5,
    options: [
      { optionId: 1, selected: false, surcharge: 10 },
      { optionId: 2, selected: false, surcharge: 20 },
      { optionId: 3, selected: true, surcharge: 30 },
    ],
  },
];
