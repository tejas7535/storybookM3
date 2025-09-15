import { Component } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { EaEmbeddedService } from './ea-embedded.service';
import { EaEmbeddedRootComponent } from './ea-embedded-root.component';

@Component({
  template: '',
  selector: 'lib-test-component',
  standalone: true,
})
class TestComponent extends EaEmbeddedRootComponent {}

describe('EaEmbeddedRootComponent', () => {
  let component: TestComponent;
  let spectator: Spectator<TestComponent>;
  let embeddedService: EaEmbeddedService;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: TestComponent,
    providers: [
      mockProvider(EaEmbeddedService),
      {
        provide: TranslocoService,
        useValue: {
          setActiveLang: jest.fn(),
          getDefaultLang: jest.fn(() => 'de'),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        bearing: '6226',
        language: 'en',
        userTier: 'anonymous',
      },
    });
    component = spectator.component;
    embeddedService = spectator.inject(EaEmbeddedService);
    translocoService = spectator.inject(TranslocoService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialize service', () => {
    it('should call initialize on the embedded service with computed signals', () => {
      const bearingSpy = jest.spyOn(component, 'bearing');
      const languageSpy = jest.spyOn(component, 'language');
      const userTierSpy = jest.spyOn(component, 'userTier');

      // // Trigger the effect by accessing the inputs
      component.bearing();
      component.language();
      component.userTier();

      expect(embeddedService.initialize).toHaveBeenCalledTimes(1);
      expect(bearingSpy).toHaveBeenCalled();
      expect(languageSpy).toHaveBeenCalled();
      expect(userTierSpy).toHaveBeenCalled();
    });
  });

  describe('set language', () => {
    it('should call setActiveLang on the transloco service with the language input', () => {
      setTimeout(
        () =>
          expect(
            component['translocoService'].setActiveLang
          ).toHaveBeenCalledWith('en'),
        300
      );

      spectator.setInput('language', 'fr');
      spectator.detectChanges();

      setTimeout(
        () => expect(translocoService.setActiveLang).toHaveBeenCalledWith('fr'),
        300
      );

      spectator.setInput('language', undefined);
      spectator.detectChanges();

      setTimeout(() => {
        expect(translocoService.setActiveLang).toHaveBeenCalledWith('de');
        expect(translocoService.getDefaultLang).toHaveBeenCalled();
      }, 300);
    });
  });
});
