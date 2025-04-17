import { FontOptions, Paddings } from '../../core/format';

export interface Product {
  imageUrl?: string;
  designation: string;
  description?: string;
  id?: string;
  quantity?: number;
}

export interface ProductGroup {
  title: string;
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
  labelColor: string;
  spacing: {
    header?: Paddings;
    productRow?: Paddings;
    designationMargin?: number;
  };
}

export interface Props {
  style?: Partial<Style>;
  data: ProductGroup[];
  allowGroupBreaks?: boolean;
  labels: {
    quantity: string;
    id: string;
  };
}

export interface PrecomputedLayout {
  header: {
    title: string;
  };
  cell: {
    imageX: number;
    productDetailsX: number;
    productDetailsWidth: number;
    productIdX: number;
    productIdWidth: number;
    quantityColumnX: number;
    quantityColumnWidth: number;
  };
  rows: {
    height: number;
    data: ArrayElement<ArrayElement<Props['data']>['products']>;
  }[];
}
