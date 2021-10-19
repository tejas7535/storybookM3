import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../assets/i18n/en.json';
import { setDisplay, setPredictionRequest } from '../store';
import { initialState as initialInputState } from '../store/reducers/input.reducer';
import { initialState as initialPredictionState } from '../store/reducers/prediction.reducer';
import { TooltipModule } from './../../../shared/components/tooltip/tooltip.module';
import { InputComponent } from './input.component';
import { LimitsComponent } from './limits/limits.component';
import { MaterialComponent } from './material/material.component';
import { SelectComponent } from './select/select.component';
import { SliderComponent } from './slider/slider.component';
import { SliderControl } from './slider/slider.model';
import { ToggleComponent } from './toggle/toggle.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let spectator: Spectator<InputComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: InputComponent,
    declarations: [
      InputComponent,
      MaterialComponent,
      SliderComponent,
      SelectComponent,
      ToggleComponent,
      LimitsComponent,
    ],
    imports: [
      NoopAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSelectModule,
      MatSliderModule,
      MatInputModule,
      MatExpansionModule,
      MatDividerModule,
      MatSlideToggleModule,
      ReactiveComponentModule,
      TooltipModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          ltp: {
            input: initialInputState,
            prediction: initialPredictionState,
          },
        },
      }),
    ],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {});

  describe('#patchForm', () => {});

  describe('#adjustES', () => {
    const mockedInputForm = new FormGroup({});
    const mockedFormControls = new SliderControl({
      key: 'es',
      name: 'RESIDUAL_STRESS',
      min: -70,
      max: 70,
      step: 10,
      disabled: false,
      formControl: new FormControl(230),
    });
    const mockedEsFormControl = mockedInputForm.registerControl(
      mockedFormControls.key,
      mockedFormControls.formControl
    );
    let mockSelectedHV = 133;

    it('should have an adjustES function that limits the sliders value if necessary', () => {
      const materialControls: SliderControl[] = [mockedFormControls];
      component.materialControls = materialControls;
      component.adjustES(mockedEsFormControl, mockSelectedHV);

      expect(mockedEsFormControl.value).toBe(70);
      expect((component.materialControls[0] as SliderControl).min).toBe(-70);
      expect((component.materialControls[0] as SliderControl).max).toBe(70);
    });

    it('should adjust control to max value', () => {
      mockSelectedHV = 150;

      component.materialControls = [mockedFormControls];
      component.adjustES(mockedEsFormControl, mockSelectedHV);

      expect(mockedEsFormControl.value).toBe(mockedFormControls.max);
    });
  });

  describe('#setPredictionRequest', () => {
    it('should trigger a dispatch setPredictionRequest to store', () => {
      store.dispatch = jest.fn();

      const mockPredictionRequestControls = {
        showMurakami: false,
        showFKM: true,
        showStatistical: true,
        spreading: 0,
        hv: 699,
        rz: 12.9,
        hv_core: 500,
        rArea: 5,
        es: 0,
        mpa: 400,
        v90: 1,
        rrelation: -1,
        burdeningType: 0,
      };
      const mockPreviourPredictionRequestControls = {
        showMurakami: false,
        showFKM: true,
        showStatistical: true,
        spreading: 0,
        hv: 800,
        rz: 12.9,
        hv_core: 500,
        rArea: 5,
        es: 0,
        mpa: 400,
        v90: 1,
        rrelation: -1,
        burdeningType: 0,
      };

      const expectedPredictionRequest = {
        spreading: 0,
        hv: 699,
        hv_lower: 699,
        hv_upper: 699,
        rz: 12.9,
        hv_core: 500,
        rArea: 5,
        es: 0,
        mpa: 400,
        v90: 1,
        rrelation: -1,
        burdeningType: 0,
      };

      const expectedStatisticalRequest = {
        rz: 12.9,
        es: 0,
        rArea: 5,
        v90: 1,
        hardness: 699,
        r: -1,
        loadingType: 0,
      };

      component.setPredictionRequest(
        mockPredictionRequestControls,
        mockPreviourPredictionRequestControls
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        setPredictionRequest({
          predictionRequest: expectedPredictionRequest,
          statisticalRequest: expectedStatisticalRequest,
        })
      );
    });
  });

  describe('#setDisplay', () => {
    it('should trigger a dispatch setDisplay to store', () => {
      store.dispatch = jest.fn();

      const mockDisplayControls = {
        showMurakami: false,
        showFKM: true,
        showStatistical: true,
        spreading: 0,
        hv: 699,
        rz: 12.9,
        hv_core: 500,
        rArea: 5,
        es: 0,
        mpa: 400,
        v90: 1,
        rrelation: -1,
        burdeningType: 0,
      };

      const expectedDisplay = {
        showMurakami: false,
        showFKM: true,
        showStatistical: true,
      };
      component.setDisplay(mockDisplayControls);
      expect(store.dispatch).toHaveBeenCalledWith(
        setDisplay({
          display: expectedDisplay,
        })
      );
    });
  });

  describe('#isSlider', () => {});

  describe('#isSelect', () => {});

  describe('#isToggle', () => {});

  describe('#dropdownHardness', () => {});

  describe('#sliderHardness', () => {});

  describe('#adjustLimits', () => {
    it('should dispatch setPredictionRequest', () => {
      store.dispatch = jest.fn();
      const limits = {
        prediction: 0,
        mpa: 400,
        v90: 1,
        hv: 180,
        hv_lower: 180,
        hv_upper: 180,
        rrelation: -1,
        burdeningType: 0,
        model: 5,
        spreading: 0,
        rArea: 5,
        es: 0,
        rz: 0,
        hv_core: 500,
        a90: 100,
        gradient: 1,
        multiaxiality: 0,
      };

      component.adjustLimits(limits);

      expect(store.dispatch).toHaveBeenCalledWith(
        setPredictionRequest({
          predictionRequest: limits,
          statisticalRequest: limits,
        })
      );
    });
  });

  describe('#describeControls', () => {});

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
