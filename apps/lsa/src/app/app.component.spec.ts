import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';
import { RestService } from './core/services/rest.service';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let component: AppComponent;

  let restService: RestService;
  let translocoService: TranslocoService;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      MockModule(MatDividerModule),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: RestService,
        useValue: {
          getGreases: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    component = spectator.debugElement.componentInstance;

    restService = spectator.inject(RestService);
    translocoService = spectator.inject(TranslocoService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    spectator.detectChanges();
    const title = spectator.query('h1').textContent.trim();
    expect(title).toContain('appTitle');
  });

  describe('when initialized', () => {
    let languageSelectionSpy: jest.SpyInstance;
    beforeEach(() => {
      languageSelectionSpy = jest.spyOn(translocoService, 'setActiveLang');
    });

    describe('when language is available', () => {
      beforeEach(() => {
        component.language = 'de';
      });

      it('should set provided language', () => {
        spectator.detectChanges();
        expect(languageSelectionSpy).toHaveBeenCalledWith('de');
      });
    });

    describe('when language is not available', () => {
      it('should set fallback language', () => {
        spectator.detectChanges();
        expect(languageSelectionSpy).toHaveBeenCalledWith('en');
      });
    });

    it('should fetch greases', () => {
      component.fetchGreases = jest.fn();

      component.ngOnInit();

      expect(component.fetchGreases).toHaveBeenCalled();
    });
  });

  describe('fetchGreases', () => {
    it('should call fetchGreases', () => {
      component.fetchGreases();

      expect(restService.getGreases).toHaveBeenCalled();
    });
  });
});
