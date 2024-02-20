export interface RecommendationRequest {
  lubricationPoints: string;
  lubricationInterval: string;
  lubricationQty: number;
  pipeLength: number;
  optime: number;
  greaseId: string;
  medium: string;
  minTemp: number;
  maxTemp: number;
  battery: number;
}
