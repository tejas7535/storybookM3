import { LastOfferDetail } from './last-offer-detail.model';
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
  public gqPositionId: string;
  public quotationItemId: number;
  public material: MaterialDetails;
  public orderQuantity: number;
  public plant: Plant;
  public productionPlant: Plant;
  public price: number;
  public gqRating: number;
  public recommendedPrice: number;
  public lastCustomerPrice: number;
  public lastCustomerPriceDate: string;
  public percentDifference: number;
  public gpc: number;
  public sqv: number;
  public rlt: number;
  public productionSegment: number;
  public strategicPrice: number;
  public priceSource: string;
  public customerMaterial: string;
  public coefficient1: number;
  public coefficient2: number;
  public relocationCost: number;
  public relocatedProductionPlant: Plant;
  public lastOfferDetail: LastOfferDetail;

  // properties added in GQ application
  public netValue: number;
  public gpi: number;
  public gpm: number;
  public rlm: number;
}
