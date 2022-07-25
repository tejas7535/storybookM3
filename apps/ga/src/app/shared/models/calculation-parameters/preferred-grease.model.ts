export interface PreferredGreaseOption {
  id: string;
  text: string;
}

export interface PreferredGrease {
  loading: boolean;
  greaseOptions: PreferredGreaseOption[];
  selectedGrease: PreferredGreaseOption;
  maxTemperature?: number;
  viscosity?: number;
  nlgiClass?: number;
}
