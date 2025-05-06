import { Accessory } from '@lsa/shared/models';

import { Product, ProductGroup } from '@schaeffler/pdf-generator';

import { FormDataType } from './pdf-generator.service';

type CombinedProductType = { group: string } & Product;

export const chooseSelectedProducts = (
  tableData: FormDataType,
  lookupMap: Map<string, Accessory>
) => {
  const products: CombinedProductType[] = [];

  for (const [group, mappings] of Object.entries(tableData)) {
    for (const [matnr, qty] of Object.entries(mappings)) {
      const accessory = lookupMap.get(matnr);
      if (!accessory || qty < 1) {
        continue;
      }
      products.push({
        group,
        pimid: accessory.pim_code,
        imageUrl: accessory.product_image,
        designation: accessory.designation,
        description: accessory.description,
        id: accessory.matnr,
        quantity: qty,
        price: accessory.price,
        currency: accessory.currency,
        available: accessory.availability,
      });
    }
  }

  return products;
};

export const makeProductGroups = (inputProducts: CombinedProductType[]) => {
  const groupMap = new Map<string, Product[]>();

  for (const product of inputProducts) {
    const key = product.group;
    if (groupMap.has(key)) {
      groupMap.get(key).push(product);
    } else {
      groupMap.set(key, [product]);
    }
  }

  const productGroups: ProductGroup[] = [];
  for (const [group, products] of groupMap.entries()) {
    const groupTotal = products
      .reduce((acc, prod) => acc + prod.price * prod.quantity, 0)
      .toFixed(2);
    const groupCurrency = products
      .filter((prod) => prod.currency)
      .pop()?.currency;
    productGroups.push({
      title: group,
      price:
        groupTotal && groupCurrency
          ? `${groupTotal} ${groupCurrency}`
          : undefined,
      products,
    });
  }

  return productGroups;
};
