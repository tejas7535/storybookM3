import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import { GreaseCalculationComponent } from './grease-calculation.component';

describe('GreaseCalculationComponent', () => {
  let component: GreaseCalculationComponent;
  let spectator: Spectator<GreaseCalculationComponent>;

  const createComponent = createComponentFactory({
    component: GreaseCalculationComponent,
    imports: [NoopAnimationsModule, RouterTestingModule, BreadcrumbsModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
