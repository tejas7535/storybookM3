import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DeltaAmountComponent } from './delta-amount.component';

describe('DeltaAmountComponent', () => {
  let component: DeltaAmountComponent;
  let spectator: Spectator<DeltaAmountComponent>;

  const createComponent = createComponentFactory({
    component: DeltaAmountComponent,
    imports: [provideTranslocoTestingModule({})],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
