export interface CatalogServiceBasicFrequenciesResult {
  data?: {
    status: string;
    message: string;
    results: [
      {
        id: string;
        title: string;
        fields: Frequency[];
      }
    ];
  };
}

export interface Frequency {
  id: string;
  title: string;
  abbreviation: string;
  conditions?: { visible: boolean; editable: boolean };
  values?: [
    {
      content: string;
      index: number;
      unit: string;
    }
  ];
}
