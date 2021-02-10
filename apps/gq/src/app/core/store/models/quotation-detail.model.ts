import { Plant } from './plant.model';

export class QuotationDetail {
  public quotationId: string;
  public gqCreated: string;
  public gqLastUpdated: string;
  public gqCreatedByUserId: string;
  public gqCreatedByUser: string;
  public gqLastUpdatedByUserId: string;
  public gqLastUpdatedByUser: string;
  public addedToOffer: boolean;
  public gqPositionId: string;
  public sapQuotationItemId: string;
  public materialNumber15: string;
  public materialDescription: string;
  public orderQuantity: number;
  public plant: Plant;
  public productionPlant: Plant;
  public price: number;
  public recommendedPrice: number;
  public lastCustomerPrice: number;
  public percentDifference: number;
  public finalRecommendedSellingPrice: number;
  public gpc: number;
  public sqv: number;
  public rlt: number;
  public productionSegment: number;
  public priceSource: string;

  // properties added in GQ application
  public margin: number;
  public netValue: number;
}
