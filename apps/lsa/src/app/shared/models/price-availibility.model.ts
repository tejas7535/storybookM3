export interface MediasCallbackResponse {
  items: {
    [key: string]: {
      available?: boolean;
      price?: number;
      currency?: string;
    };
  };
}

export interface AvailabilityRequestEvent {
  details: {
    payload: {
      pimIds: string[];
    };
  };
  callback: (result: MediasCallbackResponse) => void;
}
