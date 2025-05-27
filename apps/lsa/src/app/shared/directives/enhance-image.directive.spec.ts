import { MatDialog } from '@angular/material/dialog';

import {
  createDirectiveFactory,
  mockProvider,
  SpectatorDirective,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { EnhanceImageDirective } from './enhance-image.directive';
import { ImagePreviewComponent } from './image-preview.component';

describe('EnhanceImageDirective', () => {
  let spectator: SpectatorDirective<EnhanceImageDirective>;

  const createDirective = createDirectiveFactory({
    directive: EnhanceImageDirective,
    template: `<img lsaEnhanceImage src="https://example.com/test.png" />`,
    providers: [mockProvider(MatDialog, { open: jest.fn() })],
    imports: [MockComponent(ImagePreviewComponent)],
  });

  beforeEach(() => {
    spectator = createDirective();
  });

  it('should get the instance', () => {
    expect(spectator).toBeTruthy();
  });

  it('clicking should open a dialog', () => {
    spectator.dispatchMouseEvent(spectator.element, 'click');

    expect(spectator.directive['matDialog'].open).toHaveBeenCalledWith(
      expect.any(Function),
      { data: { src: 'https://example.com/test.png' } }
    );
  });
});
