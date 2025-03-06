import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { map, Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { IdValue } from '../../models';
import { UserFeedback } from './models';

@Component({
  selector: 'ia-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  standalone: false,
})
export class FeedbackDialogComponent implements OnInit {
  options: Observable<IdValue[]>;
  label: Observable<string>;
  form: FormGroup;
  isLoading: Observable<boolean>;
  categoryFormControl: FormControl<IdValue> = new FormControl<IdValue>(
    undefined,
    Validators.required
  );
  messageFormControl: FormControl<string> = new FormControl<string>(
    '',
    Validators.required
  );
  onFeebackSubmitted: EventEmitter<UserFeedback> = new EventEmitter();

  private readonly TRANSLATION_PREFIX = 'user.feedback.dialog';

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: { loading: Observable<boolean> }
  ) {}

  ngOnInit(): void {
    this.options = this.getOptionsAsync();
    this.label = this.translocoService.selectTranslate(
      `${this.TRANSLATION_PREFIX}.instruction`
    );
    this.form = this.createFormGroup();
    this.isLoading = this.data.loading;
  }

  getOptionsAsync(): Observable<IdValue[]> {
    return this.translocoService
      .selectTranslateObject(`${this.TRANSLATION_PREFIX}.options`)
      .pipe(
        map((options: Map<string, string>) =>
          Object.values(options).map(
            (value, index) => new IdValue(index.toString(), value)
          )
        )
      );
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      category: this.categoryFormControl,
      message: this.messageFormControl,
    });
  }

  onSubmit() {
    const feedback: UserFeedback = {
      category: this.categoryFormControl.value.value,
      message: this.messageFormControl.value,
    };
    this.onFeebackSubmitted.emit(feedback);
  }
}
