import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { NoDataOverlayComponent } from './no-data.component';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key} mocked`),
}));

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
