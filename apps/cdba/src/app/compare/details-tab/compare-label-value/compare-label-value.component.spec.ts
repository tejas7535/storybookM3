import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockModule } from 'ng-mocks';

import { CompareLabelValueComponent } from './compare-label-value.component';

describe('CompareLabelValueComponent', () => {
  let component: CompareLabelValueComponent;
  let spectator: Spectator<CompareLabelValueComponent>;

  const createComponent = createComponentFactory({
    component: CompareLabelValueComponent,
    imports: [PushModule, MockModule(MatTooltipModule)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
