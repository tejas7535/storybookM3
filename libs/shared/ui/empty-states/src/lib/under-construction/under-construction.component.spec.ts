import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { UnderConstructionComponent } from './under-construction.component';

describe('UnderConstructionComponent', () => {
  let spectator: Spectator<UnderConstructionComponent>;
  let component: UnderConstructionComponent;

  const createComponent = createComponentFactory({
    component: UnderConstructionComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
