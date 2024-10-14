export interface MaterialAutoCompleteResponse {
  results: MaterialAutoComplete[];
}

export interface MaterialAutoComplete {
  materialNumber15: string;
  materialDescription: string;
  customerMaterial: string;
  deliveryUnit?: number;
  unitOfMeasurement?: string;
}
