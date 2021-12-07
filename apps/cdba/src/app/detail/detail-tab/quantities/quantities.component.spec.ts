import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LabelValueModule } from '../label-value/label-value.module';
import { QuantitiesComponent } from './quantities.component';

describe('QuantitiesComponent', () => {
  let spectator: Spectator<QuantitiesComponent>;
  let component: QuantitiesComponent;

  const createComponent = createComponentFactory({
    component: QuantitiesComponent,
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
