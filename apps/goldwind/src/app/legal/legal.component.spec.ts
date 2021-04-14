import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ReplaySubject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { terms } from '../../assets/legal';
import { LegalComponent } from './legal.component';

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
    imports: [RouterTestingModule],
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

  it('should call the destroy methods', () => {
    const nextSpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalledTimes(1);
  });

  it('should load the terms of use content if the route says so', () => {
    eventSubject.next(new NavigationEnd(undefined, '/terms-of-use', undefined));

    expect(component.legal).toEqual(terms);
  });
});
