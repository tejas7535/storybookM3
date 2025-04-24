import { FontOptions, Paddings } from '../../core/format';

export interface Product {
  pimid: string;
  imageUrl?: string;
  designation: string;
  description?: string;
  id?: string;
  quantity?: number;

  price?: number;
  currency?: string;
  available?: boolean;
}

export interface ProductGroup {
  title: string;
  price?: string;
  products: Product[];
}

type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer ElementType)[] ? ElementType : never;

export interface Style {
  headerBackground: string;
  headerFont: FontOptions;
  imageWidth: number;
  gap: number;
  dividerColor: string;
  designationFont: FontOptions;
  labelFont: FontOptions;
  verticalMargin: number;
  labelColor: string;
  spacing: {
    header?: Paddings;
    productRow?: Paddings;
    designationMargin?: number;
  };
  avilabilityColors: {
    inStock: string;
    outOfStock: string;
  };
  priceFont: FontOptions;
}

export interface Props {
  style?: Partial<Style>;
  data: ProductGroup[];
  allowGroupBreaks?: boolean;
  showAvailabilityAndPriceWhenAvailabile?: boolean;
  labels: {
    quantity: string;
    id: string;
    price?: string;
    availability?: {
      inStock: string;
      outOfStock: string;
    };
  };
}

export interface PrecomputedLayout {
  header: {
    title: string;
    price?: string;
  };
  cell: {
    imageX: number;
    productDetailsX: number;
    productDetailsWidth: number;
    productIdX: number;
    productIdWidth: number;
    quantityColumnX: number;
    quantityColumnWidth: number;
    priceColumnX?: number;
    priceColumnWidth?: number;
    availabilityColumnX?: number;
    availabilityColumnWidth?: number;
  };
  rows: {
    height: number;
    data: ArrayElement<ArrayElement<Props['data']>['products']>;
  }[];
}

export const DefaultFont: FontOptions = {
  fontFamily: 'Noto',
  fontSize: 8,
  fontStyle: 'normal',
} as const;

export const DefaultStyles: Style = {
  headerBackground: '#f6f7f8',
  imageWidth: 18,
  gap: 5,
  verticalMargin: 1.12,
  designationFont: {
    ...DefaultFont,
    fontSize: 10,
    fontStyle: 'bold',
  },
  headerFont: {
    ...DefaultFont,
    fontSize: 11,
  },
  priceFont: {
    ...DefaultFont,
    fontStyle: 'bold',
  },
  avilabilityColors: {
    inStock: '#27893c',
    outOfStock: '#c1c0c0',
  },
  dividerColor: '#f6f7f8',
  labelFont: DefaultFont,
  labelColor: '#000',
  spacing: {
    header: {
      left: 2,
      right: 2,
      top: 3,
      bottom: 3,
    },
    productRow: {
      left: 2,
      right: 2,
      top: 2,
      bottom: 2,
    },
    designationMargin: 2,
  },
};
