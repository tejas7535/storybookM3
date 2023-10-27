import { ComparableLinkedTransaction } from '@gq/core/store/reducers/models';
import {
  ComparableMaterialsRowData,
  FPricingComparableMaterials,
  Material,
} from '@gq/core/store/reducers/transactions/models/f-pricing-comparable-materials.interface';

export const COMPARABLE_MATERIALS_ROW_DATA_MOCK: ComparableMaterialsRowData[] =
  [
    {
      parentMaterialDescription: '22210-E1-XL#N1',
      parentMaterialNumber: '016703529-0000-10',

      identifier: 1,
      customerName: 'dsfsdfs sdf , S.A.',
      materialDescription: '1_22210-E1-XL#N1',
      price: 26.7138,
      quantity: 4,
      year: '2018',
    } as ComparableMaterialsRowData,
    {
      parentMaterialDescription: '22210-E1-XL#N1',
      parentMaterialNumber: '016703529-0000-10',

      identifier: 2,
      customerName: 'sdf sdf sssdf hinery, S.A.',
      materialDescription: '2_22210-E1-XL#N1',
      price: 26.7138,
      quantity: 4,

      year: '2018',
    } as ComparableMaterialsRowData,
    {
      parentMaterialDescription: '22210-E1-XL#N1',
      parentMaterialNumber: '016703529-0000-10',

      identifier: 3,
      customerName: 'vvvvvv inery, S.A.',
      materialDescription: '3_22210-E1-XL#N1',
      price: 26.7138,
      quantity: 4,
      year: '2018',
    } as ComparableMaterialsRowData,
    {
      parentMaterialDescription: '22210-E1-XL#N1',
      parentMaterialNumber: '016703529-0000-10',

      identifier: 4,
      customerName: 'bbbbbbbbbbbbbbbbA.',
      materialDescription: '4_22210-E1-XL#N1',
      price: 26.7138,
      quantity: 4,
      year: '2018',
    } as ComparableMaterialsRowData,
    {
      parentMaterialDescription: '22210-E1-XL#N1',
      parentMaterialNumber: '016703529-0000-10',

      identifier: 5,
      customerName: 'Ibercisa Deck Machinery, S.A.',
      materialDescription: '5_22210-E1-XL#N1',
      price: 26.7138,
      quantity: 4,
      year: '2018',
    } as ComparableMaterialsRowData,

    {
      parentMaterialDescription: '55555-E1-XL#N1',
      parentMaterialNumber: '00011111-0000-10',

      identifier: 6,
      customerName: 'Ibercisa Deck Machinery, S.A.',
      materialDescription: '2345345-E1-XL#N1',
      price: 26.7138,
      quantity: 4,
      year: '2018',
    } as ComparableMaterialsRowData,
    {
      parentMaterialDescription: '55555-E1-XL#N1',
      parentMaterialNumber: '00011111-0000-10',

      identifier: 7,
      customerName: 'Ibercisa Deck Machinery, S.A.',
      materialDescription: '225443210-E1-XL#N1',
      price: 26.7138,
      quantity: 4,
      year: '2018',
    } as ComparableMaterialsRowData,
    {
      parentMaterialDescription: '55555-E1-XL#N1',
      parentMaterialNumber: '00011111-0000-10',

      identifier: 8,
      customerName: 'Ibercisa Deck Machinery, S.A.',
      materialDescription: '45453-E1-XL#N1',
      price: 26.7138,
      quantity: 4,
      year: '2018',
    } as ComparableMaterialsRowData,
    {
      parentMaterialDescription: '55555-E1-XL#N1',
      parentMaterialNumber: '00011111-0000-10',

      identifier: 9,
      customerName: 'Ibercisa Deck Machinery, S.A.',
      materialDescription: '22210-E1-XL#N1',
      price: 26.7138,
      quantity: 4,
      year: '2018',
    } as ComparableMaterialsRowData,
    {
      parentMaterialDescription: '55555-E1-XL#N1',
      parentMaterialNumber: '00011111-0000-10',

      identifier: 10,
      customerName: 'Ibercisa Deck Machinery, S.A.',
      materialDescription: '22210-E1-XL#N1',
      price: 26.7138,
      quantity: 4,
      year: '2018',
    } as ComparableMaterialsRowData,
  ];

export const F_PRICING_COMPARABLE_MATERIALS_MOCK: FPricingComparableMaterials[] =
  [
    {
      similarityScore: 0.9,
      material: {
        materialDescription: 'desc1',
        materialNumber: '0000-1234-5678',
      } as unknown as Material,
      transactions: [
        {
          customerName: 'customerName1',
          materialDescription: 'matDesc1',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
        {
          customerName: 'customerName2',
          materialDescription: 'matDesc2',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
        {
          customerName: 'customerName3',
          materialDescription: 'matDesc3',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
        {
          customerName: 'customerName4',
          materialDescription: 'matDesc4',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
        {
          customerName: 'customerName6',
          materialDescription: 'matDesc6',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
      ],
    },
    {
      similarityScore: 0.7,
      material: {
        materialDescription: 'desc2',
        materialNumber: '0000-1111-2222',
      } as unknown as Material,
      transactions: [
        {
          customerName: 'customerName1',
          materialDescription: 'matDesc1',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
        {
          customerName: 'customerName2',
          materialDescription: 'matDesc2',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
        {
          customerName: 'customerName3',
          materialDescription: 'matDesc3',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
        {
          customerName: 'customerName4',
          materialDescription: 'matDesc4',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
        {
          customerName: 'customerName6',
          materialDescription: 'matDesc6',
          price: 26.7138,
          quantity: 4,
          year: 2010,
        } as unknown as ComparableLinkedTransaction,
      ],
    },
  ];
