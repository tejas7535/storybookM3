import { TranslocoService } from '@jsverse/transloco';
import { ProductImageResolverService } from '@mm/shared/services/product-image-resolver.service';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { ProductImageComponent } from './product-image.component';

describe('ProductImageComponent', () => {
  let spectator: Spectator<ProductImageComponent>;

  const createComponent = createComponentFactory({
    component: ProductImageComponent,
    providers: [
      mockProvider(TranslocoService),
      mockProvider(ProductImageResolverService, {
        resolveImageDesignation: jest.fn(() => `imageurl`),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should call the resolver with the provided designation', () => {
    spectator.setInput('designation', '6226');
    spectator.detectChanges();
    expect(
      spectator.component['imageResolver'].resolveImageDesignation
    ).toHaveBeenCalled();
    expect(
      spectator.component['translocoService'].translate
    ).toHaveBeenCalled();
  });
});
