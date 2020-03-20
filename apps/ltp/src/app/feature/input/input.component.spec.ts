import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { TooltipModule } from '../../shared/components/tooltip/tooltip.module';

import { InputComponent } from './input.component';
import { LimitsComponent } from './limits/limits.component';
import { MaterialComponent } from './material/material.component';
import { SelectComponent } from './select/select.component';
import { SliderComponent } from './slider/slider.component';
import { ToggleComponent } from './toggle/toggle.component';

import { initialState as initialInputState } from '../../core/store/reducers/input.reducer';
import { initialState as initialPredictionState } from '../../core/store/reducers/prediction.reducer';

import { SliderControl } from './slider/slider.model';

import * as en from '../../../assets/i18n/en.json';
import * as fromStore from '../../core/store';
import { PredictionRequest } from '../../shared/models';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let store: Store<fromStore.LTPState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        InputComponent,
        MaterialComponent,
        SliderComponent,
        SelectComponent,
        ToggleComponent,
        LimitsComponent
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
        TooltipModule,
        provideTranslocoTestingModule({ en })
      ],
      providers: [
        provideMockStore({
          initialState: {
            input: initialInputState,
            prediction: initialPredictionState
          }
        })
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store);
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
      min: -90,
      max: 90,
      step: 10,
      disabled: false,
      formControl: new FormControl(230)
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

    it('should increase branch coverage', () => {
      mockSelectedHV = 150;

      component.materialControls = [mockedFormControls];
      component.adjustES(mockedEsFormControl, mockSelectedHV);
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
      const limits: PredictionRequest = {
        prediction: 0,
        mpa: 400,
        v90: 0,
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
        multiaxiality: 0
      };

      component.adjustLimits(limits);

      expect(store.dispatch).toHaveBeenCalledWith(
        fromStore.setPredictionRequest({
          predictionRequest: limits
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
