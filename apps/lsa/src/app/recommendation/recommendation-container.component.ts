import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, Subject, takeUntil } from 'rxjs';

import { transformFormValue } from '@lsa/core/services/form-helper';
import { LsaFormService } from '@lsa/core/services/lsa-form.service';
import { RestService } from '@lsa/core/services/rest.service';
import { RecommendationForm } from '@lsa/shared/models';
import { LetDirective, PushPipe } from '@ngrx/component';

import { ApplicationComponent } from './application/application.component';
import { LubricantComponent } from './lubricant/lubricant.component';
import { LubricationPointsComponent } from './lubrication-points/lubrication-points.component';

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
  ],
  templateUrl: './recommendation-container.component.html',
})
export class RecommendationContainerComponent implements OnInit, OnDestroy {
  @Input() currentStep$: Observable<number>;

  public readonly form: FormGroup<RecommendationForm> =
    this.formService.getRecommendationForm();
  public readonly lubricationPointsForm =
    this.formService.getLubricationPointsForm();
  public readonly lubricantForm = this.formService.getLubricantForm();
  public readonly applicationForm = this.formService.getApplicationForm();

  greases$ = this.restService.greases$;
  recommendation$ = this.restService.recommendation$;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly formService: LsaFormService,
    private readonly restService: RestService
  ) {}

  ngOnInit(): void {
    this.currentStep$.pipe(takeUntil(this.destroy$)).subscribe((step) => {
      this.dispatchDelayedInput(step);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dispatchDelayedInput(index: number): void {
    if (index === 3) {
      this.fetchResult();

      return;
    }
  }

  fetchResult(): void {
    this.restService.getLubricatorRecommendation(
      transformFormValue(this.form.getRawValue())
    );
  }
}
