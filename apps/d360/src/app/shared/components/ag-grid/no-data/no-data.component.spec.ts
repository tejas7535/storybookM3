import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { NoDataOverlayComponent } from './no-data.component';

describe('NoDataOverlayComponent', () => {
  let spectator: Spectator<NoDataOverlayComponent>;

  const createComponent = createComponentFactory({
    component: NoDataOverlayComponent,
    componentMocks: [],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
