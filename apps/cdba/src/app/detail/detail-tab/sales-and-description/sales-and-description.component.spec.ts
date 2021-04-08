import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { MaterialNumberModule } from '@cdba/shared';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SalesAndDescriptionComponent } from './sales-and-description.component';

describe('SalesAndDescriptionComponent', () => {
  let spectator: Spectator<SalesAndDescriptionComponent>;
  let component: SalesAndDescriptionComponent;

  const createComponent = createComponentFactory({
    component: SalesAndDescriptionComponent,
    imports: [
      UndefinedAttributeFallbackModule,
      MaterialNumberModule,
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
