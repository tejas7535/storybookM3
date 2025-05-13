import { By } from '@angular/platform-browser';

import { TranslocoService } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppAdCardComponent } from './app-ad-card.component';

describe('EaAppAdCard', () => {
  let component: AppAdCardComponent;
  let spectator: Spectator<AppAdCardComponent>;

  const createComponent = createComponentFactory({
    component: AppAdCardComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(TranslocoService, {
        translate: jest.fn((input) => input),
      }),
    ],
    detectChanges: true,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        imageUrl: '/assets/test.svg',
        translocoPrefix: 'testprefix',
      },
    });
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('image icon', () => {
    it('should be present in component when provided', () => {
      const container = spectator.debugElement.query(By.css('.promo-app-icon'));
      expect(container).toBeTruthy();
    });

    it('should be omitted fromo component when no image is there', () => {
      spectator.setInput('imageUrl', undefined);
      const container = spectator.debugElement.query(By.css('.promo-app-icon'));
      expect(container).toBeFalsy();
    });
  });

  describe('translocoPrefix', () => {
    it('should affect all calls to getTranslation', () => {
      spectator.setInput('translocoPrefix', 'helloworld');
      component['getTranslation']('testkey');
      expect(component['translocoService'].translate).toHaveBeenCalledWith(
        'helloworld.testkey'
      );
    });

    it('should build the CTA url base on the prefix', () => {
      spectator.setInput('translocoPrefix', 'helloworld');
      expect(component['translocoService'].translate).toHaveBeenCalledWith(
        'helloworld.externalUrl'
      );
    });
  });

  describe('external url', () => {
    it('attaches the utm parameters to the url', () => {
      spectator.setInput('includeUTM', true);
      const link = spectator.debugElement.query(By.css('a'));
      expect(link.attributes.href).toBe(
        'testprefix.externalUrl?utm_source=grease-app&utm_medium=app'
      );

      expect(link.attributes.target).toBe('_blank');
    });

    it('omits the UTM parameters', () => {
      spectator.setInput('includeUTM', false);
      const link = spectator.debugElement.query(By.css('a'));
      expect(link.attributes.href).toBe('testprefix.externalUrl');

      expect(link.attributes.target).toBe('_blank');
    });
  });
});
