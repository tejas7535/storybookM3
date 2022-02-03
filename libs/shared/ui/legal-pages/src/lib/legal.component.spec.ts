import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ReplaySubject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';

import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from './i18n/en.json';
import { LegalComponent } from './legal.component';
import { PERSON_RESPONSIBLE, TERMS_OF_USE } from './legal.model';

const eventSubject = new ReplaySubject<RouterEvent>(1);
const routerMock = {
  navigate: jest.fn(),
  events: eventSubject.asObservable(),
  url: 'someUrl',
};

describe('LegalComponent', () => {
  let component: LegalComponent;
  let spectator: Spectator<LegalComponent>;

  const createComponent = createComponentFactory({
    component: LegalComponent,
    imports: [
      RouterTestingModule,
      TranslocoTestingModule,
      SubheaderModule,
      provideTranslocoTestingModule({ 'forbidden/en': en }),
    ],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            url: '/imprint',
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
        useValue: "I don't care about the law",
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [LegalComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    it('should call the destroy methods', () => {
      const nextSpy = jest.spyOn(component.destroy$, 'next');
      const completeSpy = jest.spyOn(component.destroy$, 'complete');

      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(completeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('route subscribtion within ngOnInit', () => {
    it('should load the terms of use content if the route says so', () => {
      eventSubject.next(new NavigationEnd(1, '/terms-of-use', ''));

      expect(component.legal).toEqual('termsOfUse');
    });

    it('should load the imprint content if the route says so', () => {
      eventSubject.next(new NavigationEnd(1, '/imprint', ''));

      expect(component.legal).toEqual('imprint');
    });

    it('should load the data privacy content if the route says so', () => {
      eventSubject.next(new NavigationEnd(1, '/data-privacy', ''));

      expect(component.legal).toEqual('dataPrivacy');
    });

    it('should load the cookie policy content if the route says so', () => {
      eventSubject.next(new NavigationEnd(1, '/cookie-policy', ''));

      expect(component.legal).toEqual('cookiePolicy');
    });
  });

  describe('navigate', () => {
    it('should trigger the router navigate to the root route', () => {
      routerMock.navigate = jest.fn();

      component.navigate();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
