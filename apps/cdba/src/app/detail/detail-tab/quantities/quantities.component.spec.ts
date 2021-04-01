import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { QuantitiesComponent } from './quantities.component';

registerLocaleData(de);

describe('QuantitiesComponent', () => {
  let spectator: Spectator<QuantitiesComponent>;
  let component: QuantitiesComponent;

  const createComponent = createComponentFactory({
    component: QuantitiesComponent,
    imports: [provideTranslocoTestingModule({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
