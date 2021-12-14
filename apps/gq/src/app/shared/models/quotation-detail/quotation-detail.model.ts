import { LastOfferDetail } from './last-offer-detail.model';
import { MaterialDetails } from './material-details.model';
import { MaterialStockByPlant } from './material-stock-by-plant.model';
import { Plant } from './plant.model';
import { PriceSource } from './price-source.enum';
import { SapPriceCondition } from './sap-price-condition.enum';

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
  public priceSource: PriceSource;
  public customerMaterial: string;
  public coefficient1: number;
  public coefficient2: number;
  public relocationCost: number;
  public relocatedProductionPlant: Plant;
  public lastOfferDetail: LastOfferDetail;
  public comment: string;
  public sapPrice: number;
  public sapPriceCondition: SapPriceCondition;
  public sapGrossPrice: number;
  public materialStockByPlant: MaterialStockByPlant;

  // properties added in GQ application
  public netValue: number;
  public gpi: number;
  public gpm: number;
  public rlm: number;
  public discount: number;
}
