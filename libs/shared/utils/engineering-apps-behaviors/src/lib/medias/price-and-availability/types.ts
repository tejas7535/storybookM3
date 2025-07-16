import { MediasID } from '../../types';

export interface CallbackData {
  items: {
    [key: MediasID]: {
      available?: boolean;
      price?: number;
      currency?: string;
    };
  };
}

type RequestCallback = (result: CallbackData) => void;

export interface AvailabilityRequest {
  details: {
    payload: {
      pimIds: MediasID[];
    };
  };
  callback: RequestCallback;
}
