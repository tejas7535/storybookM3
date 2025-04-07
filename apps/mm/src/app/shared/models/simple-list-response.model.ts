interface SimpleList {
  id: string;
  title: string;
  available: boolean;
  image: string;
  selected: boolean;
}

export type SimpleListResponse = SimpleList[];
