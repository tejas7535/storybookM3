import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GlobalSearchResultsPreviewListComponent } from '../global-search-results-preview-list/global-search-results-preview-list.component';
import { GlobalSearchModalComponent } from './global-search-modal.component';

describe('GlobalSearchModalComponent', () => {
  let component: GlobalSearchModalComponent;
  let spectator: Spectator<GlobalSearchModalComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSearchModalComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
      FormsModule,
      ReactiveFormsModule,
    ],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
    ],
    declarations: [
      GlobalSearchModalComponent,
      GlobalSearchResultsPreviewListComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    test('should call dialogRef.close', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearInputField', () => {
    test('should clear input and reset displayed material numbers', () => {
      component.materialNumbersToDisplay = ['00000000000', '111111111111'];
      component.searchFormControl.patchValue('1234');

      component.clearInputField();

      expect(component.materialNumbersToDisplay).toEqual([]);
      expect(component.searchFormControl.value).toEqual('');
    });
  });
});
