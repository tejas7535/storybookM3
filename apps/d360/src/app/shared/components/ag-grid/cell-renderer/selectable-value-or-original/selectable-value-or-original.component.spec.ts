import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { SelectableValueOrOriginalCellRendererComponent } from './selectable-value-or-original.component';

describe('SelectableValueOrOriginalCellRendererComponent', () => {
  let spectator: Spectator<SelectableValueOrOriginalCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: SelectableValueOrOriginalCellRendererComponent,
    imports: [],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
