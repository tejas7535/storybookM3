import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { TotalCostShareComponent } from './total-cost-share.component';

describe('BomTableTotalCostShareStatusBarComponent', () => {
  let component: TotalCostShareComponent;
  let spectator: Spectator<TotalCostShareComponent>;

  const createComponent = createComponentFactory({
    component: TotalCostShareComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
