import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { DataHintComponent } from './data-hint.component';

describe('DataHintComponent', () => {
  let spectator: Spectator<DataHintComponent>;

  const createComponent = createComponentFactory({
    component: DataHintComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        text: 'Hello from Test',
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
