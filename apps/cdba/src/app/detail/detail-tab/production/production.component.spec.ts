import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DetailsLabelValueModule } from '../details-label-value';
import { ProductionComponent } from './production.component';

describe('ProductionComponent', () => {
  let spectator: Spectator<ProductionComponent>;
  let component: ProductionComponent;

  const createComponent = createComponentFactory({
    component: ProductionComponent,
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
