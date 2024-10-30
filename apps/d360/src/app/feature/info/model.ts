export interface VersionData {
  version?: string;
}

// original file path: /src/domain/info/useCurrency.ts
// TODO align with Renè if it is ok to delete all the types from this file
export interface CurrencyData {
  currentCurrency: string;
  availableCurrencies: string[];
  setCurrentCurrency: (currency: string) => void;
}
