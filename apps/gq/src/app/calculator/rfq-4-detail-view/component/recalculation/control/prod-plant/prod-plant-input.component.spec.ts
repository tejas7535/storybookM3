import { signal } from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

import { Rfq4DetailViewStore } from '@gq/calculator/rfq-4-detail-view/store/rfq-4-detail-view.store';
import { AutocompleteSelectionComponent } from '@gq/shared/components/autocomplete-selection/autocomplete-selection.component';
import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponents, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CALCULATOR_RFQ_4_PROCESS_DATA_MOCK,
  RFQ_PRODUCTION_PLANTS,
} from '../../../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { ProdPlantInputComponent } from './prod-plant-input.component';

describe('ProdPlantInputComponent', () => {
  let component: ProdPlantInputComponent;
  let spectator: Spectator<ProdPlantInputComponent>;
  const fb = new FormBuilder();

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.control(null),
  });

  const createComponent = createComponentFactory({
    component: ProdPlantInputComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      ReactiveFormsModule,
      MockComponents(AutocompleteSelectionComponent),
    ],
    providers: [
      {
        provide: FormGroupDirective,
        useValue: formGroupDirective,
      },
      {
        provide: Rfq4DetailViewStore,
        useValue: {
          getProductionPlants: signal(RFQ_PRODUCTION_PLANTS),
          getProcessProductionPlant: signal(
            CALCULATOR_RFQ_4_PROCESS_DATA_MOCK.processProductionPlant
          ),
          getProductionPlantsLoading: signal(false),
          getSelectedProdPlant: signal('0072'),
        },
      },
      MockProvider(TranslocoLocaleService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        formControlName: 'test',
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('productionPlantsOptions', () => {
    test('should map production plants to selectable values', () => {
      const productionPlantSelectableValues =
        component.productionPlantsOptions();
      const expected: SelectableValue[] = [
        {
          id: '0001',
          value: 'Plant One',
          value2: 'PL',
          defaultSelection: false,
        },
        {
          id: '0002',
          value: 'Plant Two',
          value2: 'DE',
          defaultSelection: false,
        },
        {
          id: '0072',
          value: 'Plant Three',
          value2: 'US',
          defaultSelection: true,
        },
      ];
      expect(productionPlantSelectableValues).toEqual(expected);
    });
  });
});
