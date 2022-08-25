import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { DetailsLabelValueModule } from '../details-label-value';
import { SalesAndDescriptionComponent } from './sales-and-description.component';

describe('SalesAndDescriptionComponent', () => {
  let spectator: Spectator<SalesAndDescriptionComponent>;
  let component: SalesAndDescriptionComponent;

  const createComponent = createComponentFactory({
    component: SalesAndDescriptionComponent,
    imports: [
      UndefinedAttributeFallbackModule,
      provideTranslocoTestingModule({ en: {} }),
      DetailsLabelValueModule,
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
