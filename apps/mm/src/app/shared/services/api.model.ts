export type ProductDesignation = string;

export interface ProductImagesResponse {
  product_images: {
    [key: ProductDesignation]: string;
  };
}
