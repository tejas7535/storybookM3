import { QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

import { firstValueFrom, of, Subject } from 'rxjs';

import { LocalStorageService } from '@ea/core/local-storage';
import {
  resetCalculationParameters,
  setSelectedLoadcase,
} from '@ea/core/store/actions/calculation-parameters/calculation-parameters.actions';
import { resetCalculationResult } from '@ea/core/store/actions/calculation-result/catalog-calculation-result.actions';
import { ProductSelectionTemplate } from '@ea/core/store/models';
import { APP_STATE_MOCK } from '@ea/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersComponent } from './calculation-parameters.component';
import { LoadCaseDataFormGroupModel } from './loadcase-data-form-group.interface';
import { ParameterTemplateDirective } from './parameter-template.directive';

describe('CalculationParametersComponent', () => {
  let component: CalculationParametersComponent;
  let spectator: Spectator<CalculationParametersComponent>;
  let store: MockStore;
  let storageService: LocalStorageService;

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
      RouterTestingModule,
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
      {
        provide: LocalStorageService,
        useValue: {
          restoreStoredSession: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    component = spectator.debugElement.componentInstance;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
    storageService = spectator.inject(LocalStorageService);
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
      component.matDialog.open = jest.fn();

      component.onShowBasicFrequenciesDialogClick();

      expect(component.matDialog.open).toHaveBeenCalled();
    });

    it('should open calculation types dialog', () => {
      component.matDialog.open = jest.fn();

      component.onShowCalculationTypesClick();

      expect(component.matDialog.open).toHaveBeenCalled();
    });
  });

  describe('onAddLoadCaseClick', () => {
    it('should add a loadcase', () => {
      component['updateFirstLoadCaseName'] = jest.fn();
      component['createLoadCaseDataFormGroup'] = jest.fn(
        () => ({}) as FormGroup<LoadCaseDataFormGroupModel>
      );
      component.operationConditionsForm.controls['loadCaseData'].push =
        jest.fn();

      expect(component['loadCaseCount']).toEqual(1);

      component.onAddLoadCaseClick();

      expect(component['updateFirstLoadCaseName']).toHaveBeenCalled();
      expect(component['createLoadCaseDataFormGroup']).toHaveBeenCalled();
      expect(
        component.operationConditionsForm.controls['loadCaseData'].push
      ).toHaveBeenCalledWith({} as FormGroup<LoadCaseDataFormGroupModel>);
      expect(component['loadCaseCount']).toEqual(2);
    });
  });

  describe('onSelectedLoadCaseChange', () => {
    it('should dispatch loadcase selection action', () => {
      component.onSelectedLoadCaseChange(2);

      expect(store.dispatch).toHaveBeenCalledWith(
        setSelectedLoadcase({ selectedLoadcase: 2 })
      );
    });
  });

  describe('updateFirstLoadCaseName', () => {
    it('should update the first loadcase name', () => {
      component[
        'calculationParametersFormHelperService'
      ].getLocalizedLoadCaseName = jest.fn(() => 'loadcase test');
      component['loadCaseCount'] = 2;
      component.operationConditionsForm.controls[
        'loadCaseData'
      ].controls[0].controls.loadCaseName.setValue = jest.fn();

      component['updateFirstLoadCaseName']();

      expect(component['loadCaseCount']).toEqual(1);
      expect(
        component.operationConditionsForm.controls['loadCaseData'].controls[0]
          .controls.loadCaseName.setValue
      ).toHaveBeenCalledWith('loadcase test');
    });
  });

  describe('ngOnInit', () => {
    it('should restore parameters after templates have been loaded', () => {
      const mockTemplates = new Subject<{
        loadcaseTemplate: ProductSelectionTemplate[];
        operatingConditionsTemplate: ProductSelectionTemplate[];
      }>();

      component['productSelectionFacade'].templates$ = mockTemplates;

      component.ngOnInit();

      mockTemplates.next({
        loadcaseTemplate: [],
        operatingConditionsTemplate: [],
      });

      expect(storageService.restoreStoredSession).toHaveBeenCalled();
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
