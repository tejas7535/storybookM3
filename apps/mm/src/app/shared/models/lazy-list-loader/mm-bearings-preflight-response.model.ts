export interface MMBearingPreflightField {
  id: string;
  range: { id: string; title: string }[] | null;
  defaultValue: string;
}

export interface MMBearingPreflightResponse {
  data: {
    input: {
      id: string;
      title: string;
      fields: MMBearingPreflightField[];
    }[];
  };
}
