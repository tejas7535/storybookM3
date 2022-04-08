import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SharedPipesModule } from '../../../pipes/shared-pipes.module';
import { MaterialPriceHeaderContentComponent } from './material-price-header-content.component';

describe('MaterialPriceHeaderContentComponent', () => {
  let component: MaterialPriceHeaderContentComponent;
  let spectator: Spectator<MaterialPriceHeaderContentComponent>;

  const createComponent = createComponentFactory({
    component: MaterialPriceHeaderContentComponent,
    imports: [provideTranslocoTestingModule({}), SharedPipesModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
