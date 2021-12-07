import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LabelValueModule } from '../label-value/label-value.module';
import { SalesAndDescriptionComponent } from './sales-and-description.component';

describe('SalesAndDescriptionComponent', () => {
  let spectator: Spectator<SalesAndDescriptionComponent>;
  let component: SalesAndDescriptionComponent;

  const createComponent = createComponentFactory({
    component: SalesAndDescriptionComponent,
    imports: [
      UndefinedAttributeFallbackModule,
      provideTranslocoTestingModule({ en: {} }),
      LabelValueModule,
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
