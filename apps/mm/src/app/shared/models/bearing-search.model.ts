export interface BearingOption {
  id: string;
  title: string;
  isThermal: boolean;
  isMechanical: boolean;
  isHydraulic: boolean;
}

export interface SearchResult {
  data: BearingSearchItem[];
  total: number;
}

export interface BearingSearchItem {
  name: string;
  isThermal: boolean;
  isMechanical: boolean;
  isHydraulic: boolean;
}
