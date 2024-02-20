import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { transformFormValue } from './core/services/form-helper';
import { isLanguageAvailable } from './core/services/language-helpers';
import { LsaAppService } from './core/services/lsa-app.service';
import { LsaFormService } from './core/services/lsa-form.service';
import { RestService } from './core/services/rest.service';
import {
  mockApplicationInput,
  mockLubricantInput,
  mockLubricationPointsInput,
} from './mock-form-input';
import { FALLBACK_LANGUAGE } from './shared/constants/language';
import {
  Grease,
  RecommendationForm,
  RecommendationResponse,
} from './shared/models';
import { Page } from './shared/models/page.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lubricator-selection-assistant',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @Input() language: string | undefined;

  public readonly pages: Page[] = this.lsaAppService.getPages();
  public readonly form: FormGroup<RecommendationForm> =
    this.formService.getRecommendationForm();

  public greases$: Observable<Grease[]> = this.restService.greases$;
  public result$: Observable<RecommendationResponse> =
    this.restService.recommendation$;

  private readonly TIMEOUT = 3000;

  constructor(
    private readonly lsaAppService: LsaAppService,
    private readonly translocoService: TranslocoService,
    private readonly restService: RestService,
    private readonly formService: LsaFormService
  ) {}

  ngOnInit(): void {
    const currentLanguage = isLanguageAvailable(this.language)
      ? this.language
      : FALLBACK_LANGUAGE.id;

    this.translocoService.setActiveLang(currentLanguage);

    this.fetchGreases();

    this.dispatchDelayedInput(0);
  }

  selectionChanged(event: StepperSelectionEvent): void {
    this.lsaAppService.setSelectedPage(event.selectedIndex);
    this.lsaAppService.setCompletedStep(event.previouslySelectedIndex);

    this.dispatchDelayedInput(event.selectedIndex);
  }

  dispatchDelayedInput(index: number): void {
    if (index === 3) {
      this.fetchResult();

      return;
    }

    setTimeout(() => {
      switch (index) {
        case 0:
          this.formService.updateLubricationPointsForm(
            mockLubricationPointsInput
          );
          break;
        case 1:
          this.formService.updateLubricantForm(mockLubricantInput);
          break;
        case 2:
          this.formService.updateApplicationForm(mockApplicationInput);
          break;
        default:
          break;
      }
    }, this.TIMEOUT);
  }

  fetchGreases(): void {
    this.restService.getGreases();
  }

  fetchResult(): void {
    this.restService.getLubricatorRecommendation(
      transformFormValue(this.form.getRawValue())
    );
  }
}
