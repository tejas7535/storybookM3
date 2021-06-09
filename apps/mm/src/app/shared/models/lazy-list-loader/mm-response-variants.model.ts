export interface MMResponse {
  id: string;
  title: string;
  image?: string | null;
}

export interface MMBaseResponse {
  data: MMResponse[];
}

export interface MMSimpleResponse {
  data: { data: MMResponse; _media?: [{ href: string }] }[];
}

export interface MMComplexResponse {
  data: {
    bearingSeats: {
      data: {
        id: string;
        title: string;
      };
      _media: [{ href: string }];
    }[];
  };
}

export type MMResponseVariants =
  | MMBaseResponse
  | MMSimpleResponse
  | MMComplexResponse;
