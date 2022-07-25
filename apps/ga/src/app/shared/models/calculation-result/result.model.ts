export interface Result {
  data: null; // is null in real results
  state: boolean;
  _links: Link[];
}

export interface Link {
  rel: string;
  href: string;
}
