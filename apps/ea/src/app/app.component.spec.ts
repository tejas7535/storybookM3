import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { APP_STATE_MOCK } from '@ea/testing/mocks/store';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import {
  LOCALE_CONFIG,
  LOCALE_CURRENCY_MAPPING,
  LOCALE_DEFAULT_CURRENCY,
  LOCALE_DEFAULT_LOCALE,
  LOCALE_LANG_MAPPING,
  TRANSLOCO_DATE_TRANSFORMER,
  TRANSLOCO_NUMBER_TRANSFORMER,
} from '@ngneat/transloco-locale';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((translateKey) => translateKey),
}));

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let store: any;
  let translocoService: TranslocoService;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      PushPipe,
      RouterTestingModule,
      MatIconTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: { ...APP_STATE_MOCK },
      }),
      {
        provide: LOCALE_LANG_MAPPING,
        useValue: { en: 'en-US' },
      },
      {
        provide: LOCALE_DEFAULT_LOCALE,
        useValue: 'en',
      },
      {
        provide: LOCALE_DEFAULT_CURRENCY,
        useValue: 'usd',
      },
      {
        provide: LOCALE_CONFIG,
        useValue: {},
      },
      {
        provide: LOCALE_CURRENCY_MAPPING,
        useValue: undefined,
      },
      {
        provide: TRANSLOCO_NUMBER_TRANSFORMER,
        useValue: undefined,
      },
      {
        provide: TRANSLOCO_DATE_TRANSFORMER,
        useValue: undefined,
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(Store);
    translocoService = spectator.inject(TranslocoService);
  });

  it('should create the app', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should dispatch store actions on changing inputs', () => {
    spectator.detectChanges();
    store.dispatch = jest.fn();

    component.ngOnChanges({
      bearingDesignation: {
        currentValue: 'abc',
        firstChange: true,
        previousValue: undefined,
      } as SimpleChange,
      standalone: {
        currentValue: 'true',
        firstChange: true,
        previousValue: undefined,
      } as SimpleChange,
    });

    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  describe('when language is not provided via component input', () => {
    it('should use the active language from transloco including page reload', () => {
      jest.spyOn(translocoService, 'getActiveLang').mockReturnValue('fr');
      const setActiveLang = jest.spyOn(translocoService, 'setActiveLang');

      spectator.detectChanges();
      expect(setActiveLang).toHaveBeenCalledWith('fr');
    });
  });

  describe('when language is provided via component input', () => {
    it('should use the language from component input', () => {
      component.language = 'es';
      jest.spyOn(translocoService, 'getActiveLang').mockReturnValue('fr');
      const setActiveLang = jest.spyOn(translocoService, 'setActiveLang');

      spectator.detectChanges();
      expect(setActiveLang).toHaveBeenCalledWith('es');
    });
  });
});
