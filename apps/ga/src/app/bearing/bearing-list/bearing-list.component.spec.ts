import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { selectBearing } from '../../core/store/index';
import { SharedModule } from '../../shared/shared.module';
import { BearingListComponent } from './bearing-list.component';

describe('BearingListComponent', () => {
  let component: BearingListComponent;
  let spectator: Spectator<BearingListComponent>;
  let store: MockStore;
  let snackBar: MatSnackBar;

  const createComponent = createComponentFactory({
    component: BearingListComponent,
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      ReactiveComponentModule,
      SharedModule,
      MatSnackBarModule,
      MatListModule,
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
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [BearingListComponent],
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
    test('should trigger the handleSubscriptions', () => {
      const componenthandleSubscriptionsSpy = jest.spyOn(
        component,
        'handleSubscriptions'
      );
      component.ngOnInit();
      expect(componenthandleSubscriptionsSpy).toHaveBeenCalled();
    });
  });

  describe('handleSubscriptions', () => {
    test('should trigger the snackbar if there are too many results', () => {
      component.bearingResultExtendedSearchList$ = of(
        Array.from({ length: component.manyResults + 1 })
      );

      component.handleSubscriptions();
      expect(snackBar.open).toHaveBeenCalled();
    });

    test('should not trigger the snackbar if there are too many results', () => {
      component.bearingResultExtendedSearchList$ = of(
        Array.from({ length: component.manyResults - 1 })
      );

      component.handleSubscriptions();
      expect(snackBar.open).toHaveBeenCalledTimes(0);
    });
  });

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
