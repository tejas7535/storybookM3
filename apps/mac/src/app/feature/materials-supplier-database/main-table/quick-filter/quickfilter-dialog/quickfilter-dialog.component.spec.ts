import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockModule, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  QuickFilter,
  QuickFilterType,
} from '@mac/feature/materials-supplier-database/models';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';

import * as en from '../../../../../../assets/i18n/en.json';
import { QuickfilterDialogComponent } from './quickfilter-dialog.component';

describe('QuickfilterDialogComponent', () => {
  let component: QuickfilterDialogComponent;
  let spectator: Spectator<QuickfilterDialogComponent>;

  const createComponent = createComponentFactory({
    component: QuickfilterDialogComponent,
    imports: [
      MockPipe(PushPipe),
      MockModule(ReactiveFormsModule),
      MockModule(MatDialogModule),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
      mockProvider(DataFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should prefill input fields in edit mode', () => {
      const quickFilter = {
        title: 'sth',
        description: 'test description',
      } as QuickFilter;
      component.data = { quickFilter, edit: true, delete: false };
      component.ngOnInit();

      expect(component.edit).toBeTruthy();
      expect(component.delete).toBeFalsy();
      expect(component.titleControl.value).toBe(quickFilter.title);
      expect(component.descriptionControl.value).toBe(quickFilter.description);
      expect(component.radioControl.disabled).toBe(true);
      expect(component.radioControl.value).toBe(
        QuickFilterType.LOCAL_FROM_CURRENT_VIEW
      );
    });

    it('should prefill input fields in add mode', () => {
      const quickFilter = {
        title: 'sth',
        description: 'test description',
      } as QuickFilter;
      component.data = { quickFilter, edit: false, delete: false };
      component.ngOnInit();

      expect(component.edit).toBeFalsy();
      expect(component.delete).toBeFalsy();
      expect(component.titleControl.value).toBe(quickFilter.title);
      expect(component.descriptionControl.value).toBe(quickFilter.description);
    });

    it('should prefill input fields in delete mode', () => {
      const quickFilter = { title: 'sth' } as QuickFilter;
      component.data = { quickFilter, edit: false, delete: true };
      component.ngOnInit();

      expect(component.edit).toBeFalsy();
      expect(component.delete).toBeTruthy();
      expect(component.titleControl.value).toBe(quickFilter.title);
      expect(component.radioControl.disabled).toBe(true);
    });

    it('should add description to form group on edit if filter is public', () => {
      const quickFilter = {
        id: 200,
      } as QuickFilter;
      component.data = { quickFilter, edit: true, delete: false };
      component.ngOnInit();

      expect(component.formGroup.contains('description')).toBe(true);
    });

    it('should not add description to form group on edit if filter is local', () => {
      const quickFilter = {
        id: undefined,
        title: 'test',
      } as QuickFilter;
      component.data = { quickFilter, edit: true, delete: false };
      component.ngOnInit();

      expect(component.formGroup.contains('description')).toBe(false);
    });

    it('should add description to form group on filter type change for public filter', () => {
      component['determineOperationButtonTranslationKeySuffix'] = jest.fn();
      expect(component.formGroup.contains('description')).toBe(false);

      component.ngOnInit();
      component.radioControl.setValue(QuickFilterType.PUBLIC);

      expect(component.formGroup.contains('description')).toBe(true);
    });

    it('should remove description from form group on filter type change for non public filter', () => {
      component['determineOperationButtonTranslationKeySuffix'] = jest.fn();
      component.formGroup.addControl(
        'description',
        component.descriptionControl
      );

      component.ngOnInit();
      component.radioControl.setValue(QuickFilterType.LOCAL_FROM_STANDARD);

      expect(component.formGroup.contains('description')).toBe(false);
    });
  });

  it('closeDialog should close dialog', () => {
    component.dialogRef.close = jest.fn();
    component.closeDialog();
    expect(component.dialogRef.close).toBeCalled();
  });

  describe('applyDialog', () => {
    it('should close dialog and set data for add', () => {
      component.dialogRef.close = jest.fn();
      component.radioControl.setValue(QuickFilterType.PUBLIC);
      component.titleControl.setValue('sth');
      component.descriptionControl.setValue('test description');
      component.edit = false;
      component.delete = false;
      component.applyDialog();

      const result = {
        title: 'sth',
        description: 'test description',
        quickFilterType: QuickFilterType.PUBLIC,
        edit: false,
        delete: false,
      };

      expect(component.dialogRef.close).toBeCalledWith(result);
    });
    it('should close dialog and set data for edit', () => {
      component.dialogRef.close = jest.fn();
      component.titleControl.setValue('edit');
      component.radioControl.setValue(QuickFilterType.LOCAL_FROM_CURRENT_VIEW);
      component.edit = true;
      component.delete = false;
      component.applyDialog();

      const result = {
        title: 'edit',
        quickFilterType: QuickFilterType.LOCAL_FROM_CURRENT_VIEW,
        edit: true,
        delete: false,
      };

      expect(component.dialogRef.close).toBeCalledWith(result);
    });
    it('should close dialog and set data for delete', () => {
      component.dialogRef.close = jest.fn();
      component.titleControl.setValue('delete');
      component.radioControl.setValue(QuickFilterType.LOCAL_FROM_CURRENT_VIEW);
      component.edit = false;
      component.delete = true;
      component.applyDialog();

      const result = {
        title: 'delete',
        quickFilterType: QuickFilterType.LOCAL_FROM_CURRENT_VIEW,
        edit: false,
        delete: true,
      };

      expect(component.dialogRef.close).toBeCalledWith(result);
    });
  });

  describe('onSubmit', () => {
    it('should close dialog if form is valid', () => {
      component.applyDialog = jest.fn();
      component.titleControl.setValue('test');
      component.onSubmit();

      expect(component.applyDialog).toBeCalled();
    });

    it('should do nothing if form is invalid', () => {
      component.applyDialog = jest.fn();
      component.titleControl.setValue(undefined, { emitEvent: false });
      component.onSubmit();

      expect(component.applyDialog).not.toBeCalled();
    });
  });

  describe('determineOperationButtonTranslationKeySuffix', () => {
    it('should return confirm_publish on add public filter', () => {
      component.radioControl.setValue(QuickFilterType.PUBLIC);
      component['determineOperationButtonTranslationKeySuffix']();

      expect(component.operationButtonTranslationKeySuffix).toBe(
        'confirm_publish'
      );
    });

    it('should return confirm_edit on edit', () => {
      component.edit = true;
      component['determineOperationButtonTranslationKeySuffix']();

      expect(component.operationButtonTranslationKeySuffix).toBe(
        'confirm_edit'
      );
    });

    it('should return confirm_add on add', () => {
      component.add = true;
      component['determineOperationButtonTranslationKeySuffix']();

      expect(component.operationButtonTranslationKeySuffix).toBe('confirm_add');
    });

    it('should return confirm_delete on delete', () => {
      component.add = false;
      component.delete = true;
      component['determineOperationButtonTranslationKeySuffix']();

      expect(component.operationButtonTranslationKeySuffix).toBe(
        'confirm_delete'
      );
    });

    it('should emit on destroy', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});
