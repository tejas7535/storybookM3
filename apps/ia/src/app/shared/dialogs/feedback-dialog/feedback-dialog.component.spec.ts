import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslocoService } from '@ngneat/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { IdValue } from '../../models';
import { SelectInputModule } from '../../select-input/select-input.module';
import { SharedModule } from '../../shared.module';
import { FeedbackDialogComponent } from './feedback-dialog.component';
import { UserFeedback } from './models';

describe('FeedbackDialogComponent', () => {
  let component: FeedbackDialogComponent;
  let spectator: Spectator<FeedbackDialogComponent>;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: FeedbackDialogComponent,
    imports: [
      SharedModule,
      SharedTranslocoModule,
      SelectInputModule,
      provideTranslocoTestingModule({ en: {} }),
      LoadingSpinnerModule,
      MatDialogModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule,
    ],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    translocoService = spectator.inject(TranslocoService);
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call create form group', () => {
      component.createFormGroup = jest.fn();

      component.ngOnInit();

      expect(component.createFormGroup).toHaveBeenCalled();
    });

    test('should prepare options for dropdown', () => {
      component.getOptionsAsync = jest.fn();

      component.ngOnInit();

      expect(component.getOptionsAsync).toHaveBeenCalled();
    });

    test('should get translation for label', () => {
      component.getOptionsAsync = jest.fn();
      translocoService.selectTranslate = jest.fn();

      component.ngOnInit();

      expect(translocoService.selectTranslate).toHaveBeenCalledWith(
        'user.feedback.dialog.instruction'
      );
    });
  });

  describe('createFormGroup', () => {
    test('should create form group', () => {
      const result = component.createFormGroup();

      expect(result).toBeDefined();
      expect(result.get('category')).toBeDefined();
      expect(result.get('message')).toBeDefined();
    });
  });

  describe('onSubmit', () => {
    test('should emit feedback on submit', () => {
      component.categoryFormControl = new FormControl<IdValue>({
        id: '0',
        value: 'idea',
      });
      component.messageFormControl = new FormControl<string>('new idea');
      const expectedFeedback: UserFeedback = {
        category: component.categoryFormControl.value.value,
        message: component.messageFormControl.value,
      };
      component.onFeebackSubmitted.emit = jest.fn();

      component.onSubmit();

      expect(component.onFeebackSubmitted.emit).toHaveBeenCalledWith(
        expectedFeedback
      );
    });
  });
});
