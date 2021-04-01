import { registerLocaleData } from '@angular/common';
import de from '@angular/common/locales/de';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ProductionComponent } from './production.component';

registerLocaleData(de);

describe('ProductionComponent', () => {
  let spectator: Spectator<ProductionComponent>;
  let component: ProductionComponent;

  const createComponent = createComponentFactory({
    component: ProductionComponent,
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
