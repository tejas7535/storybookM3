import { MaterialDetails } from './material-details.model';
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
  public material: MaterialDetails;
  public orderQuantity: number;
  public plant: Plant;
  public productionPlant: Plant;
  public price: number;
  public gqRating: number;
  public recommendedPrice: number;
  public lastCustomerPrice: number;
  public percentDifference: number;
  public gpc: number;
  public sqv: number;
  public rlt: number;
  public productionSegment: number;
  public fixedPrice: number;
  public priceSource: string;

  // properties added in GQ application
  public netValue: number;
  public gpi: number;
}
