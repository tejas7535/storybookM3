import { CommonModule } from '@angular/common';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

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
});
