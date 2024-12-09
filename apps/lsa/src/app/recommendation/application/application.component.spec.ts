import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';

import { TranslocoModule } from '@jsverse/transloco';
import { RadioButtonGroupComponent } from '@lsa/shared/components/radio-button-group/radio-button-group.component';
import { mockApplicationForm } from '@lsa/testing/mocks/form.mock';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ApplicationComponent } from './application.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('ApplicationComponent', () => {
  let spectator: Spectator<ApplicationComponent>;
  let component: ApplicationComponent;

  const createComponent = createComponentFactory({
    component: ApplicationComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    spectator.setInput('applicationForm', mockApplicationForm);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have lsa-radio button component', () => {
    spectator.detectChanges();
    const radioButton = spectator.query(RadioButtonGroupComponent);
    expect(radioButton).toBeTruthy();
    expect(radioButton.options).toMatchSnapshot();
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
  });
});
