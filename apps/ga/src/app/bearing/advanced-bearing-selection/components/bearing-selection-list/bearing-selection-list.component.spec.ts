import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MockModule } from 'ng-mocks';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { SearchAutocompleteOption } from '@schaeffler/search-autocomplete';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { selectBearing } from '@ga/core/store';

import { BearingSelectionListComponent } from './bearing-selection-list.component';

describe('BearingSelectionListComponent', () => {
  let component: BearingSelectionListComponent;
  let spectator: Spectator<BearingSelectionListComponent>;
  let store: MockStore;
  let snackBar: MatSnackBar;

  const createComponent = createComponentFactory({
    component: BearingSelectionListComponent,
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(ReactiveComponentModule),
      MockModule(MatListModule),
      MatSnackBarModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          bearing: {
            extendedSearch: {
              resultList: [],
            },
          },
        },
      }),
    ],
    declarations: [BearingSelectionListComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    snackBar = spectator.inject(MatSnackBar);

    store.dispatch = jest.fn();
    component['snackbar'].open = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should trigger the snackbar if there are too many results', () => {
      component.bearingResultExtendedSearchList$ = of(
        Array.from<SearchAutocompleteOption>({
          length: component.resultsLimit + 1,
        })
      );

      component.ngOnInit();

      expect(snackBar.open).toHaveBeenCalled();
    });

    it('should not trigger the snackbar if there are too many results', () => {
      component.bearingResultExtendedSearchList$ = of(
        Array.from<SearchAutocompleteOption>({
          length: component.resultsLimit - 1,
        })
      );

      expect(snackBar.open).not.toHaveBeenCalled();
    });
  });

  describe('handleSubscriptions', () => {});

  describe('selectBearing', () => {
    test('should trigger bearingSelection emit event with a bearing id', () => {
      const mockBearing = {
        id: 'mockId',
        title: 'mockTitle',
      };

      component.selectBearing(mockBearing);
      expect(store.dispatch).toHaveBeenCalledWith(
        selectBearing({ bearing: 'mockId' })
      );
    });
  });
});
