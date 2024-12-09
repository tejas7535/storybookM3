import { Inject, Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { ReplaySubject, Subject } from 'rxjs';

import {
  LubricantType,
  LubricationPoints,
  Optime,
  PowerSupply,
  RelubricationInterval,
} from '@lsa/shared/constants';
import { PipeLength } from '@lsa/shared/constants/tube-length.enum';
import {
  ApplicationForm,
  ApplicationFormValue,
  Grease,
  LSAInterval,
  LubricantForm,
  LubricantFormValue,
  LubricationPointsForm,
  LubricationPointsFormValue,
  RecommendationForm,
  RecommendationFormValue,
  RecommendationModels,
} from '@lsa/shared/models';
import { SESSION_STORAGE } from '@ng-web-apis/common';

import { DEFAULT_FORM_VALS } from './form-defaults';
import { objectCompare } from './form-helper';

const SESSION_KEY = 'lsa_form';

@Injectable({ providedIn: 'root' })
export class LsaFormService {
  lubricationPointsForm: FormGroup<LubricationPointsForm>;
  lubricantForm: FormGroup<LubricantForm>;
  applicationForm: FormGroup<ApplicationForm>;
  recommendationForm: FormGroup<RecommendationForm>;

  readonly stepCompletionStream$$ = new ReplaySubject<number>();
  readonly resetStepState$$ = new Subject<void>();
  readonly resetStepStateObservable$ = this.resetStepState$$.asObservable();

  constructor(
    @Inject(SESSION_STORAGE) private readonly sessionStorage: Storage
  ) {
    this.initForm();
  }

  public get isValid(): boolean {
    return this.recommendationForm.valid;
  }

  public saveForm() {
    try {
      const jsonString = JSON.stringify(this.recommendationForm.getRawValue());
      this.sessionStorage.setItem(SESSION_KEY, jsonString);
    } catch (error) {
      console.error(`Failed to persist LSA session state: ${error}`);
    }
  }

  public restoreSession() {
    try {
      const sessionContents = this.sessionStorage.getItem(SESSION_KEY);
      // eslint-disable-next-line unicorn/no-null
      if (sessionContents == null) {
        return;
      }
      const formValues = JSON.parse(sessionContents);
      const formBeforePatch = this.recommendationForm.getRawValue();
      this.recommendationForm.patchValue(formValues, { emitEvent: false });
      const formAfterPath = this.recommendationForm.getRawValue();

      for (const [key, value] of Object.entries(formBeforePatch)) {
        const b = formAfterPath[key as keyof typeof formBeforePatch];
        const comparisonResult = objectCompare(value, b);
        if (!comparisonResult) {
          const idx = this.mapFormKeyToStepIndex(key);
          if (idx > -1) {
            this.stepCompletionStream$$.next(idx);
          }
        }
      }
    } catch (error) {
      console.error(`Malformed JSON under session key lsa_form: ${error}`);
    }
  }

  public reset() {
    this.sessionStorage.removeItem(SESSION_KEY);
    this.resetStepState$$.next();
    const formValuesCopy = structuredClone(DEFAULT_FORM_VALS); // make sure that default Forms Vals are not mutated
    this.recommendationForm.patchValue(formValuesCopy);
  }

  public getLubricationPointsForm(): FormGroup<LubricationPointsForm> {
    return this.lubricationPointsForm;
  }

  public updateLubricationPointsForm(
    lubricationPoints: Partial<LubricationPointsFormValue>
  ) {
    this.recommendationForm.patchValue({ lubricationPoints });
  }

  public getLubricantForm(): FormGroup<LubricantForm> {
    return this.lubricantForm;
  }

  public updateLubricantForm(lubricant: Partial<LubricantFormValue>) {
    this.recommendationForm.patchValue({ lubricant });
  }

  public getApplicationForm(): FormGroup<ApplicationForm> {
    return this.applicationForm;
  }

  public updateApplicationForm(application: Partial<ApplicationFormValue>) {
    this.recommendationForm.patchValue({ application });
  }

  public getRecommendationForm(): FormGroup<RecommendationForm> {
    return this.recommendationForm;
  }

  public updateRecommendationForm(value: Partial<RecommendationFormValue>) {
    this.recommendationForm.patchValue(value);
  }

  private initForm() {
    this.lubricationPointsForm = new FormGroup<LubricationPointsForm>({
      lubricationPoints: this.createFormControl<LubricationPoints>(
        LubricationPoints.One,
        true
      ),
      lubricationInterval: this.createFormControl<RelubricationInterval>(
        RelubricationInterval.Year,
        true
      ),
      lubricationQty: this.createFormControl<number>(60),
      pipeLength: this.createFormControl<PipeLength>(PipeLength.Direct),
      optime: this.createFormControl<Optime>(Optime.NoPreference, true),
    });

    this.lubricantForm = new FormGroup<LubricantForm>({
      lubricantType: this.createFormControl<LubricantType>(
        LubricantType.Arcanol,
        true
      ),
      grease: this.createFormControl<Grease>(
        { id: 'ARCANOL_MULTI2', title: 'Arcanol MULTI2' },
        true
      ),
    });

    this.applicationForm = new FormGroup<ApplicationForm>({
      temperature: this.createFormControl<LSAInterval>(
        { min: 0, max: 30, title: '' },
        true
      ),
      battery: this.createFormControl<PowerSupply>(
        PowerSupply.NoPreference,
        true
      ),
    });

    this.recommendationForm = new FormGroup<RecommendationForm>({
      lubricationPoints: this.lubricationPointsForm,
      lubricant: this.lubricantForm,
      application: this.applicationForm,
    });
  }

  private createFormControl<T>(
    defaultValue?: T,
    required?: boolean,
    validators: ValidatorFn[] = []
  ): FormControl<T> {
    return new FormControl<T>(
      defaultValue,
      required ? [Validators.required, ...validators] : [...validators]
    );
  }

  private mapFormKeyToStepIndex(
    key: string | keyof RecommendationModels
  ): number {
    switch (key) {
      case 'lubricationPoints':
        return 0;
      case 'lubricant':
        return 1;
      case 'application':
        return 2;
      default:
        return -1;
    }
  }
}
