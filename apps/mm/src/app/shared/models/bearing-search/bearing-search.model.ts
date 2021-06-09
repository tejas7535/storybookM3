export interface BearingOption {
  id: string;
  title: string;
}

export interface SearchEntry {
  data: BearingOption;
  links: [];
  _media?: any;
}

export interface SearchResult {
  data: SearchEntry[];
}
