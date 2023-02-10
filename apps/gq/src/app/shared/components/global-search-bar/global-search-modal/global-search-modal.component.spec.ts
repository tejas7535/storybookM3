import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutoCompleteFacade } from '../../../../core/store';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
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
      PushModule,
    ],
    providers: [
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: AutoCompleteFacade,
        useValue: {
          resetView: jest.fn(),
          initFacade: jest.fn(),
          materialNumberOrDescForGlobalSearch$: of({
            filter: FilterNames.MATERIAL_NUMBER_OR_DESCRIPTION,
            items: [],
          }),
        },
      },
      provideMockStore(),
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
    test('should clear input', () => {
      component.searchFormControl.patchValue('1234');

      component.clearInputField();

      expect(component.searchFormControl.value).toEqual('');
    });
  });
});
