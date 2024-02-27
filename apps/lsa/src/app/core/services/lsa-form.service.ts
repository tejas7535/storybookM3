import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import {
  LubricantType,
  LubricationPoints,
  Optime,
  PowerSupply,
  RelubricationInterval,
} from '@lsa/shared/constants';
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
} from '@lsa/shared/models';

@Injectable({ providedIn: 'root' })
export class LsaFormService {
  lubricationPointsForm: FormGroup<LubricationPointsForm>;
  lubricantForm: FormGroup<LubricantForm>;
  applicationForm: FormGroup<ApplicationForm>;
  recommendationForm: FormGroup<RecommendationForm>;

  constructor() {
    this.initForm();
  }

  public get isValid(): boolean {
    return this.recommendationForm.valid;
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
        LubricationPoints.TwoToFour,
        true
      ),
      lubricationInterval: this.createFormControl<RelubricationInterval>(
        RelubricationInterval.Year,
        true
      ),
      lubricationQty: this.createFormControl<number>(60),
      pipeLength: this.createFormControl<LSAInterval>(
        { min: 1, max: 3, title: '1 - 3m' },
        true
      ),
      optime: this.createFormControl<Optime>(0, true),
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
      temperature: this.createFormControl<LSAInterval>(undefined, true),
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
}
