import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AddToCartService } from '@lsa/core/services/add-to-cart.service';
import {
  AddToCartEvent,
  GoogleAnalyticsService,
  ProductSelectionEvent,
  RestultBaseEvent,
  StepResultLoadEvent,
  StepResultLoadFailEvent,
  StepResultSupportLinkEvent,
} from '@lsa/core/services/google-analytics';
import { LsaFormService } from '@lsa/core/services/lsa-form.service';
import { UserTier } from '@lsa/shared/constants/user-tier.enum';
import {
  Accessory,
  ErrorResponse,
  RecommendationResponse,
} from '@lsa/shared/models';
import { MediasCallbackResponse } from '@lsa/shared/models/price-availibility.model';
import { RecommendationTableDataPipe } from '@lsa/shared/pipes/recommendation-table-data.pipe';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AccessoryTableComponent } from './accessory-table/accessory-table.component';
import { AddToCartButtonComponent } from './add-to-cart-button/add-to-cart-button.component';
import { ErrorContainerComponent } from './error-container/error-container.component';
import { RecommendationTableComponent } from './recommendation-table/recommendation-table.component';

@Component({
  selector: 'lsa-result',
  standalone: true,
  imports: [
    RecommendationTableComponent,
    RecommendationTableDataPipe,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    AccessoryTableComponent,
    MatButtonModule,
    MatIconModule,
    SharedTranslocoModule,
    AddToCartButtonComponent,
    ErrorContainerComponent,
  ],
  templateUrl: './result.component.html',
})
export class ResultComponent implements OnChanges, OnInit {
  @Input() recommendationResult: RecommendationResponse | ErrorResponse;

  @ViewChild(AccessoryTableComponent)
  accessoryTableComponent: AccessoryTableComponent;

  public readonly businessUserTier = UserTier.Business;

  isRecommendedSelected = true;
  validResult?: RecommendationResponse;
  errorInstance: ErrorResponse;
  userTier: UserTier;

  public pricesAndAvailability: MediasCallbackResponse['items'];

  constructor(
    private readonly addToCartService: AddToCartService,
    private readonly formService: LsaFormService,
    private readonly googleAnalyticsService: GoogleAnalyticsService
  ) {}

  @Input()
  set priceAndAvailabilityResponses(value: MediasCallbackResponse) {
    this.pricesAndAvailability = {
      ...this.pricesAndAvailability,
      ...value.items,
    };
  }

  ngOnInit(): void {
    if (this.validResult) {
      this.logResultPageLoadEvent();
    }

    this.userTier = this.addToCartService.getUserTier();
  }

  onRecommendedSelectedChange(isRecommendedSelected: boolean): void {
    this.isRecommendedSelected = isRecommendedSelected;
    this.logProductSelectionEvent(isRecommendedSelected);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (_changes.recommendationResult) {
      if ('name' in this.recommendationResult) {
        // TODO: Build error handling logic
        this.errorInstance = this.recommendationResult as ErrorResponse;
        this.validResult = undefined;
        this.logResultPageLoadFailEvent();
      } else {
        this.isRecommendedSelected =
          !!this.recommendationResult.lubricators.recommendedLubricator;
        this.validResult = this.recommendationResult as RecommendationResponse;
        this.errorInstance = undefined;
      }
    }
  }

  onAddToCart(): void {
    this.addToCartService.addToCartEvent(
      [...this.accessoryTableComponent.accessories],
      this.accessoryTableComponent.tableFormGroup
    );

    this.logAddToCartEvent();
  }

  onSupportLinkClick(): void {
    const supportLinkEvent: StepResultSupportLinkEvent = {
      ...this.getResultBaseEvent(),
      action: 'Click to Support',
    };

    this.googleAnalyticsService.logEvent(supportLinkEvent);
  }

  resetForm() {
    this.formService.reset();
  }

  private logAddToCartEvent(): void {
    const accessoriesWithQty = this.getAccessoriesWithQuantity();

    const product_parts = accessoriesWithQty.map((accessory) => ({
      id: accessory.matnr,
      name: accessory.designation,
      quantity: accessory.qty,
      is_recommended: accessory.is_recommendation,
    }));

    const addToCartEvent: AddToCartEvent = {
      ...this.getResultBaseEvent(),
      action: 'Add to Cart',
      selected_product_quantity: 1,
      selected_product_type: this.getProductType(this.isRecommendedSelected),
      product_parts,
    };

    this.googleAnalyticsService.logEvent(addToCartEvent);
  }

  private getAccessoriesWithQuantity(): Accessory[] {
    return this.accessoryTableComponent.accessories.filter((a) => a.qty > 0);
  }

  private logProductSelectionEvent(isRecommendedSelected: boolean): void {
    const productSelectionEvent: ProductSelectionEvent = {
      ...this.getResultBaseEvent(),
      action: 'Product Selection',
      selected_product_type: this.getProductType(isRecommendedSelected),
    };

    this.googleAnalyticsService.logEvent(productSelectionEvent);
  }

  private getProductType(
    isRecommendedSelected: boolean
  ): 'Recommended' | 'Minimum' {
    return isRecommendedSelected ? 'Recommended' : 'Minimum';
  }

  private logResultPageLoadEvent(): void {
    const { minimumRequiredLubricator, recommendedLubricator } =
      this.validResult.lubricators;

    const recommendedId = recommendedLubricator
      ? recommendedLubricator.matNr
      : '';
    const recommendedName = recommendedLubricator
      ? recommendedLubricator.name
      : '';

    const stepResultEvent: StepResultLoadEvent = {
      ...this.getResultBaseEvent(),
      action: 'Step Load',
      min_prod: {
        id: minimumRequiredLubricator.matNr,
        name: minimumRequiredLubricator.name,
      },
      recom_prod: {
        id: recommendedId,
        name: recommendedName,
      },
    };

    this.googleAnalyticsService.logEvent(stepResultEvent);
  }

  private logResultPageLoadFailEvent(): void {
    const stepResultFailEvent: StepResultLoadFailEvent = {
      ...this.getResultBaseEvent(),
      action: 'Step Load Fail',
    };

    this.googleAnalyticsService.logEvent(stepResultFailEvent);
  }

  private getResultBaseEvent(): RestultBaseEvent {
    return {
      event: 'lsa_related_interaction',
      action: '',
      step: 4,
      step_name: 'Result',
    };
  }
}
