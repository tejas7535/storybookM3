import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of, ReplaySubject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate, TranslocoTestingModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { marbles } from 'rxjs-marbles/jest';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LegalPath, LegalRoute } from '..';
import * as en from './i18n/en.json';
import { LegalComponent } from './legal.component';
import {
  CUSTOM_DATA_PRIVACY,
  CUSTOM_IMPRINT_DATA,
  DATA_SOURCE,
  PERSON_RESPONSIBLE,
  PURPOSE,
  STORAGE_PERIOD,
  TERMS_OF_USE,
} from './legal.model';

const eventSubject = new ReplaySubject<RouterEvent>(1);
const routerMock = {
  navigate: jest.fn(),
  events: eventSubject.asObservable(),
  url: 'someUrl',
};
const customDataPrivacy = 'Custom data privacy';
const customImprintData = 'some custom imprint data';

describe('LegalComponent', () => {
  let component: LegalComponent;
  let spectator: Spectator<LegalComponent>;

  const createComponent = createComponentFactory({
    component: LegalComponent,
    detectChanges: false,
    imports: [
      RouterTestingModule,
      TranslocoTestingModule,
      SubheaderModule,
      PushPipe,
      provideTranslocoTestingModule({ 'forbidden/en': en }),
    ],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            url: [{ path: `/${LegalPath.ImprintPath}` }],
          },
        },
      },
      {
        provide: Router,
        useValue: routerMock,
      },
      {
        provide: PERSON_RESPONSIBLE,
        useValue:
          'Jumbo Schreiner der gerne den besten Döner der Welt in Berlin isst',
      },
      {
        provide: TERMS_OF_USE,
        useValue: of("I don't care about the law"),
      },
      {
        provide: PURPOSE,
        useValue: of(
          'When not even life has a clear purpose, why care about this boring legal doc'
        ),
      },
      {
        provide: DATA_SOURCE,
        useValue: of(
          'Sources of data might emerge from ones mind, but not from mine'
        ),
      },
      {
        provide: CUSTOM_DATA_PRIVACY,
        useValue: of(customDataPrivacy),
      },
      {
        provide: STORAGE_PERIOD,
        useValue: of('eternity'),
      },
      {
        provide: CUSTOM_IMPRINT_DATA,
        useValue: of(customImprintData),
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should set lastPath$ correctly',
      marbles((m) => {
        component.ngOnInit();

        const newEvent = new NavigationEnd(
          0,
          `${LegalRoute}/${LegalPath.DataprivacyPath}`,
          `${LegalRoute}/${LegalPath.DataprivacyPath}`
        );
        eventSubject.next(newEvent);

        m.expect(component.lastPath$).toBeObservable(
          m.cold('(ab)', {
            a: LegalPath.ImprintPath,
            b: LegalPath.DataprivacyPath,
          })
        );
      })
    );

    test(
      'should set translationContent$ to customDataPrivacy',
      marbles((m) => {
        component.ngOnInit();

        const newEvent = new NavigationEnd(
          0,
          `${LegalRoute}/${LegalPath.DataprivacyPath}`,
          `${LegalRoute}/${LegalPath.DataprivacyPath}`
        );
        eventSubject.next(newEvent);

        m.expect(component.translationContent$).toBeObservable(
          m.cold('(ab)', {
            a: customImprintData,
            b: customDataPrivacy,
          })
        );
      })
    );

    test(
      'should set translationContent$ to customImprintData',
      marbles((m) => {
        component.ngOnInit();

        const newEvent = new NavigationEnd(
          0,
          `${LegalRoute}/${LegalPath.ImprintPath}`,
          `${LegalRoute}/${LegalPath.ImprintPath}`
        );
        eventSubject.next(newEvent);

        m.expect(component.translationContent$).toBeObservable(
          m.cold('(ab)', {
            a: customImprintData,
            b: customImprintData,
          })
        );
      })
    );
    test(
      'should set translationContent$ to default data privacy with purpose, dataSource and storagePeriod',
      marbles((m) => {
        component.ngOnInit();

        const newEvent = new NavigationEnd(
          0,
          `${LegalRoute}/${LegalPath.CookiePath}`,
          `${LegalRoute}/${LegalPath.CookiePath}`
        );
        eventSubject.next(newEvent);

        m.expect(component.translationContent$).toBeObservable(
          m.cold('(ab)', {
            a: customImprintData,
            b: LegalPath.CookiePath,
          })
        );
        m.flush();
        expect(translate).toHaveBeenCalledWith('cookie-policy', {
          personResponsible:
            'Jumbo Schreiner der gerne den besten Döner der Welt in Berlin isst',
          purpose:
            'When not even life has a clear purpose, why care about this boring legal doc',
          responsible: 'responsibleIntro',
          dataSource:
            'Sources of data might emerge from ones mind, but not from mine',
          storagePeriod: 'eternity',
        });
      })
    );
    test(
      'should set translationContent$ to default data privacy without purpose, dataSource and storagePeriod',
      marbles((m) => {
        component.purpose$ = undefined as unknown as Observable<string>;
        component.dataSource$ = undefined as unknown as Observable<string>;
        component.storagePeriod$ = undefined as unknown as Observable<string>;
        component.customImprintData$ =
          undefined as unknown as Observable<string>;
        component.ngOnInit();

        const newEvent = new NavigationEnd(
          0,
          `${LegalRoute}/${LegalPath.CookiePath}`,
          `${LegalRoute}/${LegalPath.CookiePath}`
        );
        eventSubject.next(newEvent);

        m.expect(component.translationContent$).toBeObservable(
          m.cold('(ab)', {
            a: LegalPath.ImprintPath,
            b: LegalPath.CookiePath,
          })
        );
        m.flush();
        expect(translate).toHaveBeenCalledWith('cookie-policy', {
          personResponsible:
            'Jumbo Schreiner der gerne den besten Döner der Welt in Berlin isst',
          responsible: 'responsibleIntro',
          purpose: '',
          dataSource: 'defaultDataSource',
          storagePeriod: 'defaultPeriod',
        });
      })
    );
  });

  describe('navigate', () => {
    it('should trigger the router navigate to the root route', () => {
      routerMock.navigate = jest.fn();

      component.navigate();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
