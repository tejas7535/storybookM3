import { CdkStepperModule, StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  map,
  Subject,
} from 'rxjs';

import { LsaStepperComponent } from '@lsa/core/lsa-stepper/lsa-stepper.component';
import { transformFormValue } from '@lsa/core/services/form-helper';
import { LsaAppService } from '@lsa/core/services/lsa-app.service';
import { LsaFormService } from '@lsa/core/services/lsa-form.service';
import { PriceAvailabilityService } from '@lsa/core/services/price-availability.service';
import { RestService } from '@lsa/core/services/rest.service';
import { ResultInputsService } from '@lsa/core/services/result-inputs.service';
import {
  Accessory,
  ErrorResponse,
  Page,
  RecommendationForm,
  RecommendationResponse,
} from '@lsa/shared/models';
import { MediasCallbackResponse } from '@lsa/shared/models/price-availibility.model';
import { ResultInputModel } from '@lsa/shared/models/result-inputs.model';
import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ApplicationComponent } from './application/application.component';
import { LubricantComponent } from './lubricant/lubricant.component';
import { LubricationPointsComponent } from './lubrication-points/lubrication-points.component';
import { LubricationInputsComponent } from './result/lubrication-inputs/lubrication-inputs.component';
import { ResultComponent } from './result/result.component';

@Component({
  selector: 'lsa-recommendation-container',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    PushPipe,
    LubricationPointsComponent,
    LubricantComponent,
    ApplicationComponent,
    ResultComponent,
    forwardRef(() => LsaStepperComponent),
    CdkStepperModule,
    SharedTranslocoModule,
    LubricationInputsComponent,
  ],
  templateUrl: './recommendation-container.component.html',
})
export class RecommendationContainerComponent implements OnDestroy {
  @ViewChild(LsaStepperComponent) private readonly stepper: LsaStepperComponent;

  public readonly currentStep$ = new BehaviorSubject<number>(0);
  public readonly DEBOUNCE_TIME_DEFAULT = 0; // debounce time required for slider in Application to render properly at the first load.

  public selectedStep$ = this.currentStep$
    .asObservable()
    .pipe(debounceTime(this.DEBOUNCE_TIME_DEFAULT));

  public readonly form: FormGroup<RecommendationForm> =
    this.formService.getRecommendationForm();
  public readonly lubricationPointsForm =
    this.formService.getLubricationPointsForm();
  public readonly lubricantForm = this.formService.getLubricantForm();
  public readonly applicationForm = this.formService.getApplicationForm();
  public readonly pages: Page[] = this.lsaAppService.getPages();

  greases$ = this.restService.greases$;

  priceAvailability$ =
    this.priceAvailabilityService.priceAndAvailabilityResponse$;

  recommendation$ = combineLatest([
    this.restService.recommendation$,
    this.priceAvailability$,
  ]).pipe(
    map(([recommendation, priceAndAvailability]) =>
      this.updateRecommendationWithPriceAndAvailability(
        recommendation,
        priceAndAvailability
      )
    )
  );

  public resultInputs: ResultInputModel;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formService: LsaFormService,
    private readonly restService: RestService,
    private readonly lsaAppService: LsaAppService,
    private readonly resultInputService: ResultInputsService,
    private readonly priceAvailabilityService: PriceAvailabilityService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectionChanged(event: StepperSelectionEvent): void {
    this.lsaAppService.setSelectedPage(event.selectedIndex);
    this.lsaAppService.setCompletedStep(event.previouslySelectedIndex);
    this.dispatchDelayedInput(event.selectedIndex);
    this.currentStep$.next(event.selectedIndex);
  }

  dispatchDelayedInput(index: number): void {
    if (index === 3) {
      this.fetchResult();

      return;
    }
  }

  fetchResult(): void {
    this.resultInputs = this.resultInputService.getResultInputs(
      this.form.getRawValue()
    );

    this.restService.getLubricatorRecommendation(
      transformFormValue(this.form.getRawValue())
    );
  }

  navigateToStep(step: number): void {
    this.stepper.selectStepByIndex(step);
  }

  private updateRecommendationWithPriceAndAvailability(
    recommendation: RecommendationResponse | ErrorResponse,
    mediasCallbackResponse: MediasCallbackResponse
  ): RecommendationResponse | ErrorResponse {
    if (!mediasCallbackResponse || this.isErrorResponse(recommendation)) {
      return recommendation;
    }

    const updateItems = (items: Accessory[]) => {
      items.forEach((item) =>
        this.updateItemProperties(item, mediasCallbackResponse)
      );
    };

    const updatedRecommendation = {
      ...recommendation,
      lubricators: {
        ...recommendation.lubricators,
        minimumRequiredLubricator: {
          ...recommendation.lubricators.minimumRequiredLubricator,
          bundle: [
            ...recommendation.lubricators.minimumRequiredLubricator.bundle,
          ],
        },
        recommendedLubricator: {
          ...recommendation.lubricators.recommendedLubricator,
          bundle: [...recommendation.lubricators.recommendedLubricator.bundle],
        },
      },
    };

    updateItems(
      updatedRecommendation.lubricators.minimumRequiredLubricator.bundle
    );
    updateItems(updatedRecommendation.lubricators.recommendedLubricator.bundle);

    return updatedRecommendation;
  }

  private updateItemProperties(
    accessory: Accessory,
    response: MediasCallbackResponse
  ) {
    const responseItem = response.items[accessory.pim_code];
    if (responseItem) {
      accessory.price = responseItem.price ?? accessory.price;
      accessory.currency = responseItem.currency ?? accessory.currency;
      accessory.availability = responseItem.available ?? accessory.availability;
    }
  }

  private isErrorResponse(
    response: RecommendationResponse | ErrorResponse
  ): response is ErrorResponse {
    return (response as ErrorResponse).message !== undefined;
  }
}
