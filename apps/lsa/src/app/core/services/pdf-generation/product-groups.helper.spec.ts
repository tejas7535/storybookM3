import { Accessory } from '@lsa/shared/models';

import { Product } from '@schaeffler/pdf-generator';

import { FormDataType } from './pdf-generator.service';
import {
  chooseSelectedProducts,
  makeProductGroups,
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
    const returnValue = chooseSelectedProducts(tableData, fakeLookupMap);
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
});
