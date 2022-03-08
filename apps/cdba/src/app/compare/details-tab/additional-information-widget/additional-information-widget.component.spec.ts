import { CommonModule } from '@angular/common';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AdditionalInformationWidgetComponent } from './additional-information-widget.component';

describe('AdditionalInformationWidgetComponent', () => {
  let component: AdditionalInformationWidgetComponent;
  let spectator: Spectator<AdditionalInformationWidgetComponent>;

  const createComponent = createComponentFactory({
    component: AdditionalInformationWidgetComponent,
    imports: [
      CommonModule,
      UndefinedAttributeFallbackModule,
      provideTranslocoTestingModule({}),
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('concatValues', () => {
    it('should return concatenated array as comma separated string', () => {
      expect(component.concatValues(['foo, bar'])).toBe('foo, bar');
    });

    it('should return undefined', () => {
      expect(component.concatValues(undefined)).toBeUndefined();
    });
  });
});
