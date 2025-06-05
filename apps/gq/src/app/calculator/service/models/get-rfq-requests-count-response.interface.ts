export interface GetRfqRequestsCountResponse {
  results: RfqRequestsCounts;
}

export interface RfqRequestsCounts {
  openCount: number;
  inProgressCount: number;
  doneCount: number;
}
