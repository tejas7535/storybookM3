import { CdkStepperModule, StepperSelectionEvent } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BehaviorSubject, debounceTime, Subject } from 'rxjs';

import { LsaStepperComponent } from '@lsa/core/lsa-stepper/lsa-stepper.component';
import { transformFormValue } from '@lsa/core/services/form-helper';
import { LsaAppService } from '@lsa/core/services/lsa-app.service';
import { LsaFormService } from '@lsa/core/services/lsa-form.service';
import { RestService } from '@lsa/core/services/rest.service';
import { ResultInputsService } from '@lsa/core/services/result-inputs.service';
import { Page, RecommendationForm } from '@lsa/shared/models';
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
  recommendation$ = this.restService.recommendation$;

  public resultInputs: ResultInputModel;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formService: LsaFormService,
    private readonly restService: RestService,
    private readonly lsaAppService: LsaAppService,
    private readonly resultInputService: ResultInputsService
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
}
