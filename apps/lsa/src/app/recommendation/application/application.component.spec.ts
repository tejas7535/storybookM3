import { ReactiveFormsModule } from '@angular/forms';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';

import { of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { PowerSupply } from '@lsa/shared/constants/power-supply.enum';
import { mockApplicationForm } from '@lsa/testing/mocks/form.mock';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ApplicationComponent } from './application.component';

describe('ApplicationComponent', () => {
  let spectator: Spectator<ApplicationComponent>;
  let component: ApplicationComponent;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: ApplicationComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), ReactiveFormsModule],
    declarations: [MockComponent(RadioButtonGroupComponent)],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    translocoService = spectator.inject(TranslocoService);

    component = spectator.component;
    spectator.setInput('applicationForm', mockApplicationForm);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return power supply radio options', (done) => {
    const translatePath = 'recommendation.application';
    const externalTranslation = 'External Power';
    const batteryTranslation = 'Battery Power';
    const noPreferenceTranslation = 'No Preference';

    jest
      .spyOn(translocoService, 'selectTranslate')
      .mockImplementation((key: any) => {
        switch (key) {
          case `${translatePath}.powerOptions.external`:
            return of(externalTranslation);
          case `${translatePath}.powerOptions.battery`:
            return of(batteryTranslation);
          case `${translatePath}.powerOptions.noPreference`:
            return of(noPreferenceTranslation);
          default:
            return of('');
        }
      });

    spectator.component.powerSupplyRadioOptions.subscribe((options) => {
      expect(options).toEqual([
        { value: PowerSupply.External, name: externalTranslation },
        { value: PowerSupply.Battery, name: batteryTranslation },
        { value: PowerSupply.NoPreference, name: noPreferenceTranslation },
      ]);
      done();
    });
  });

  describe('when initialized', () => {
    let matSlider: MatSlider;
    let rangeThumbs: MatSliderRangeThumb[];
    beforeEach(() => {
      spectator.detectChanges();
      matSlider = spectator.query(MatSlider);
      rangeThumbs = spectator.queryAll(MatSliderRangeThumb);
    });
    it('should have the correct form values', () => {
      expect(matSlider).toBeTruthy();
    });

    it('should have min and max values defined', () => {
      expect(matSlider.max).toBe(component['maxTemperature']);
      expect(matSlider.min).toBe(component['minTemperature']);
    });

    it('should have values thumbs defined', () => {
      expect(rangeThumbs.length).toBe(2);
      expect(rangeThumbs[0].value).toBe(5);
      expect(rangeThumbs[1].value).toBe(15);
    });

    describe('when changing temperature with minimum input', () => {
      const maxValue = 35;
      beforeEach(() => {
        spectator.component.applicationForm.get('temperature').value.max =
          maxValue;
      });
      it('should handle min temperature change correctly', () => {
        const event = { target: { value: '5' } } as unknown as Event;
        spectator.component.onMinTemperatureChange(event);
        expect(
          spectator.component.applicationForm.get('temperature').value.min
        ).toBe(5);
      });

      it('should set minimum temperature to lowest possible if exceeds scale', () => {
        const eventBelowMin = { target: { value: '-20' } } as unknown as Event;
        spectator.component.onMinTemperatureChange(eventBelowMin);
        expect(
          spectator.component.applicationForm.get('temperature').value.min
        ).toBe(-15);
      });

      it('should keep minim temperature lower or equal to maximum temperature which is selected', () => {
        const eventAboveMax = { target: { value: '150' } } as unknown as Event;
        spectator.component.onMinTemperatureChange(eventAboveMax);
        expect(
          spectator.component.applicationForm.get('temperature').value.min
        ).toBe(maxValue);
      });
    });

    describe('when changing temperature with maxinum input', () => {
      const minValue = 15;
      beforeEach(() => {
        spectator.component.applicationForm.get('temperature').value.min =
          minValue;
      });
      it('should handle max temperature change correctly', () => {
        const event = { target: { value: '50' } } as unknown as Event;
        spectator.component.onMaxTemperatureChange(event);
        expect(
          spectator.component.applicationForm.get('temperature').value.max
        ).toBe(50);
      });

      it('should set max temperature to highest possible if exceeds scale', () => {
        const eventAboveMax = { target: { value: '150' } } as unknown as Event;
        spectator.component.onMaxTemperatureChange(eventAboveMax);
        expect(
          spectator.component.applicationForm.get('temperature').value.max
        ).toBe(70);
      });

      it('should set max temperature above selected min temperature', () => {
        const eventBelowMin = { target: { value: '-5' } } as unknown as Event;
        spectator.component.onMaxTemperatureChange(eventBelowMin);
        expect(
          spectator.component.applicationForm.get('temperature').value.max
        ).toBe(minValue);
      });
    });
  });
});
