import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { MoreInformationComponent } from './more-information.component';

describe('MoreInformationComponent', () => {
  let component: MoreInformationComponent;
  let spectator: Spectator<MoreInformationComponent>;

  const createComponent = createComponentFactory({
    component: MoreInformationComponent,
    providers: [],
  });

  beforeEach(async () => {
    spectator = createComponent({
      props: {
        selectedMaterial: null,
        forecastInfo: null,
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
