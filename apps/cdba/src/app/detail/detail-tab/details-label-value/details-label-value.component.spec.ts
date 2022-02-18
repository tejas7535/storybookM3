import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { DetailsLabelValueComponent } from './details-label-value.component';

describe('DetailsLabelValueComponent', () => {
  let component: DetailsLabelValueComponent;
  let spectator: Spectator<DetailsLabelValueComponent>;

  const createComponent = createComponentFactory({
    component: DetailsLabelValueComponent,
    imports: [MockModule(UndefinedAttributeFallbackModule)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
