import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LegendsComponent } from './legends.component';

describe('LegendsComponent', () => {
  let component: LegendsComponent;
  let spectator: Spectator<LegendsComponent>;

  const createComponent = createComponentFactory({
    component: LegendsComponent,
    providers: [],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
