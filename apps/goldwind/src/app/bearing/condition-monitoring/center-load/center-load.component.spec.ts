import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CenterLoadComponent } from './center-load.component';

describe('ConditionMeasuringEquipmentComponent', () => {
  let component: CenterLoadComponent;
  let spectator: Spectator<CenterLoadComponent>;

  const createComponent = createComponentFactory({
    component: CenterLoadComponent,
    imports: [MatCardModule],
    declarations: [CenterLoadComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
