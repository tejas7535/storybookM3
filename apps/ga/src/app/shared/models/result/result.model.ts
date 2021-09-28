export interface Result {
  data: any;
  state: boolean;
  _links: Link[];
}

export interface Link {
  rel: string;
  href: string;
}
