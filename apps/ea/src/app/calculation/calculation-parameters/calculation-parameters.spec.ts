import { QueryList } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { firstValueFrom, of } from 'rxjs';

import { resetCalculationParameters } from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { resetCalculationResult } from '@ea/core/store/actions/calculation-result/catalog-calculation-result.actions';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersComponent } from './calculation-parameters';
import { ParameterTemplateDirective } from './parameter-template.directive';

describe('CalculationParametersComponent', () => {
  let component: CalculationParametersComponent;
  let spectator: Spectator<CalculationParametersComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CalculationParametersComponent,
    imports: [
      ParameterTemplateDirective,

      LetDirective,
      PushPipe,

      // Material Modules
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatTooltipModule),
      MockModule(MatSlideToggleModule),
      MockModule(MatDialogModule),

      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
      {
        provide: translate,
        useValue: jest.fn(),
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('onResetButtonClick', () => {
    it('should reset the form with initialState', () => {
      component.form.reset = jest.fn();

      component.onResetButtonClick();

      expect(store.dispatch).toHaveBeenCalledWith(resetCalculationParameters());
      expect(store.dispatch).toHaveBeenCalledWith(resetCalculationResult());
    });
  });

  describe('Dialogs', () => {
    it('should open basic frequencies dialog', () => {
      jest.spyOn(component.matDialog, 'open').mockClear();

      component.onShowBasicFrequenciesDialogClick();

      expect(component.matDialog.open).toHaveBeenCalled();
    });

    it('should open calculation types dialog', () => {
      jest.spyOn(component.matDialog, 'open').mockClear();

      component.onShowCalculationTypesClick();

      expect(component.matDialog.open).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should setup parameterTemplates after view init', async () => {
      component.templates = {
        changes: of([]),
        find: jest.fn().mockImplementation(() => ({ name: 'abc' })),
      } as unknown as QueryList<ParameterTemplateDirective>;

      component.ngAfterViewInit();

      const res = await firstValueFrom(component.parameterTemplates$);

      expect(res).toMatchSnapshot();
    });
  });
});
