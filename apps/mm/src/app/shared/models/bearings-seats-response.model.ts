export interface BearingSeatsResponse {
  bearingType: string;
  bearingSeats: {
    id: string;
    title: string;
    image: string;
    available: boolean;
  }[];
}
