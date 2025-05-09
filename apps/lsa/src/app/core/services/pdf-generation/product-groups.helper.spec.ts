import { Accessory } from '@lsa/shared/models';

import { Product, ProductGroup } from '@schaeffler/pdf-generator';

import { FormDataType } from './pdf-generator.service';
import {
  chooseSelectedProducts,
  makeProductGroups,
  summarizeProductGroups,
} from './product-groups.helper';

describe('ProductGroupsHelper', () => {
  it('chooseSelectedProducts should filter all products that are selected', () => {
    const fakeLookupMap = {
      get: jest.fn(
        () =>
          ({
            imageUrl: 'example.com',
            designation: 'Sampleproduct',
            description: '',
            matnr: '1234',
          }) as unknown as Accessory
      ),
    } as unknown as Map<string, Accessory>;
    const tableData: FormDataType = {
      Lubricators: {
        '12': 5,
        '34': 5,
      },
      'Other Stuff': {
        '99': 0,
      },
    };
    const returnValue = chooseSelectedProducts(
      tableData,
      fakeLookupMap,
      'FAKEURL'
    );
    expect(fakeLookupMap.get as jest.Func).toHaveBeenCalledTimes(3);
    expect(returnValue.length).toEqual(2);
  });

  it('makeProductGroups should reduce', () => {
    const fakeProduct: Product = {} as unknown as Product;
    const productData: Parameters<typeof makeProductGroups>[0] = [
      {
        ...fakeProduct,
        group: 'Lubricators',
      },
      {
        ...fakeProduct,
        group: 'Lubricators',
      },
      {
        ...fakeProduct,
        group: 'Cartridges',
      },
    ];

    const groups = makeProductGroups(productData);
    expect(groups.length).toEqual(2);
    expect(
      groups.find((group) => group.title === 'Lubricators').products.length
    ).toEqual(2);
  });

  describe('summarizeProductGroups', () => {
    const MOCK_PRODUCT_GROUP: ProductGroup[] = [
      {
        title: 'anything',
        products: [
          { price: 1.5, currency: 'EUR', quantity: 5 } as Product,
          { price: 4, currency: 'EUR', quantity: 1 } as Product,
        ],
      },
      {
        title: 'really anything',
        products: [
          { price: 1.5, currency: 'EUR', quantity: 5 } as Product,
          { price: 4, currency: 'EUR', quantity: 1 } as Product,
        ],
      },
    ];
    it('should return undefined for the price when called with false', () => {
      const [pieces, price] = summarizeProductGroups(MOCK_PRODUCT_GROUP, false);
      expect(price).toBeUndefined();
      expect(pieces).toEqual(12);
    });

    it('should return two valid values when called with true', () => {
      const [pieces, price] = summarizeProductGroups(MOCK_PRODUCT_GROUP, true);
      expect(price).toEqual('23.00 EUR');
      expect(pieces).toEqual(12);
    });
  });
});
