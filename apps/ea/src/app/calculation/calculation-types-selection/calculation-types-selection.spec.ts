import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CalculationParametersCalculationTypeConfig } from '@ea/core/store/models';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationTypesSelectionComponent } from './calculation-types-selection';

describe('CalculationTypesSelectionComponent', () => {
  let component: CalculationTypesSelectionComponent;
  let spectator: Spectator<CalculationTypesSelectionComponent>;
  let store: MockStore;

  const matDialogMock = {
    open: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: CalculationTypesSelectionComponent,
    imports: [
      PushPipe,

      // Material Modules
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatDividerModule),
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          ...APP_STATE_MOCK,
        },
      }),
      {
        provide: MatDialog,
        useValue: matDialogMock,
      },
      {
        provide: translate,
        useValue: jest.fn(),
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectAllChanged', () => {
    it('should dispatch select all action', () => {
      component.selectAllChanged(true);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '[Calculation Types] Select all',
        selectAll: true,
      });
    });
  });

  describe('selectionChanged', () => {
    it('should dispatch select type action', () => {
      const config = {
        name: 'emission',
        selected: true,
      } as CalculationParametersCalculationTypeConfig;
      component.selectionChanged(true, config, [config]);
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '[Calculation Types] Select type',
        calculationType: config.name,
        select: true,
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should call the destroy methods', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});
