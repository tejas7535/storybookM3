import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { TextWithDotCellRendererComponent } from './text-with-dot-cell-renderer.component';

describe('TextWithDotCellRendererComponent', () => {
  let spectator: Spectator<TextWithDotCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: TextWithDotCellRendererComponent,
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
