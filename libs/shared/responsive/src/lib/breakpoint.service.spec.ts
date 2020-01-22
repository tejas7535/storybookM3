import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { async, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { BreakpointService } from './breakpoint.service';

describe('BreakpointService', () => {
  let service: BreakpointService;

  const matchObj = [
    // initially all are false
    { matchStr: '(max-width: 599px)', result: false },
    { matchStr: '(min-width: 600px)', result: false },
    { matchStr: '(max-width: 959px)', result: false },
    {
      matchStr:
        '(max-width: 599.99px) and (orientation: portrait), (max-width: 959.99px) and (orientation: landscape)',
      result: false
    }, // isHandset
    { matchStr: '(max-width: 599.99px)', result: false }, // XSmall
    { matchStr: '(min-width: 960px) and (max-width: 1279.99px)', result: false } // Medium
  ];

  const resize = (width: number): void => {
    matchObj[0].result = width <= 599;
    matchObj[1].result = width >= 600;
    matchObj[2].result = width <= 959;
    matchObj[3].result = width <= 960; // isHandset with landscape orientation
    matchObj[4].result = width <= 960; // isLessThanMedium
    matchObj[5].result = width <= 1280 && width >= 960; // Medium
  };

  const fakeObserve = (s: string[]): Observable<BreakpointState> =>
    from(matchObj).pipe(
      filter(match => match.matchStr === s[0]),
      // tslint:disable-next-line
      map(match => <BreakpointState>{ matches: match.result, breakpoints: {} })
    );

  const breakpointObserverMock = { observe: jest.fn() };
  breakpointObserverMock.observe.mockImplementation(fakeObserve);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        BreakpointService,
        { provide: BreakpointObserver, useValue: breakpointObserverMock }
      ]
    });
  });

  test('should be createable', () => {
    service = TestBed.get(BreakpointService);
    expect(service).toBeTruthy();
  });

  describe('isMobileViewPort', () => {
    test('should return true on 400px width', done => {
      resize(400);
      service = TestBed.get(BreakpointService);
      service.isMobileViewPort().subscribe(isMobile => {
        expect(isMobile).toBe(true);
        done();
      });
    });

    test('should return false on 700px width', done => {
      resize(700);
      service = TestBed.get(BreakpointService);
      service.isMobileViewPort().subscribe(isMobile => {
        expect(isMobile).toBe(false);
        done();
      });
    });
  });

  describe('isHandset', () => {
    test('should return true on 400px width', done => {
      resize(400);
      service = TestBed.get(BreakpointService);
      service.isHandset().subscribe(isHandset => {
        expect(isHandset).toBe(true);
        done();
      });
    });

    test('should return true on 960px width', done => {
      resize(960);
      service = TestBed.get(BreakpointService);
      service.isHandset().subscribe(isHandset => {
        expect(isHandset).toBeTruthy();
        done();
      });
    });

    test('should return false on 1000px width', done => {
      resize(1000);
      service = TestBed.get(BreakpointService);
      service.isHandset().subscribe(isHandset => {
        expect(isHandset).toBeFalsy();
        done();
      });
    });
  });

  describe('isLessThanMedium', () => {
    test('should return true on 400px width', done => {
      resize(400);
      service = TestBed.get(BreakpointService);
      service.isLessThanMedium().subscribe(isLessThanMedium => {
        expect(isLessThanMedium).toBeTruthy();
        done();
      });
    });

    test('should return true on 960px width', done => {
      resize(960);
      service = TestBed.get(BreakpointService);
      service.isLessThanMedium().subscribe(isLessThanMedium => {
        expect(isLessThanMedium).toBeTruthy();
        done();
      });
    });

    test('should return true on 1000px width', done => {
      resize(1000);
      service = TestBed.get(BreakpointService);
      service.isLessThanMedium().subscribe(isLessThanMedium => {
        expect(isLessThanMedium).toBeFalsy();
        done();
      });
    });
  });

  describe('isMedium', () => {
    test('should return true on 960px width', done => {
      resize(960);
      service = TestBed.get(BreakpointService);
      service.isMedium().subscribe(isMedium => {
        expect(isMedium).toBeTruthy();
        done();
      });
    });

    test('should return true on 1280px width', done => {
      resize(1280);
      service = TestBed.get(BreakpointService);
      service.isMedium().subscribe(isMedium => {
        expect(isMedium).toBeTruthy();
        done();
      });
    });

    test('should return true on 1000px width', done => {
      resize(1000);
      service = TestBed.get(BreakpointService);
      service.isMedium().subscribe(isMedium => {
        expect(isMedium).toBeTruthy();
        done();
      });
    });

    test('should return false on 1281px width', done => {
      resize(1281);
      service = TestBed.get(BreakpointService);
      service.isMedium().subscribe(isMedium => {
        expect(isMedium).toBeFalsy();
        done();
      });
    });

    test('should return false on 959px width', done => {
      resize(959);
      service = TestBed.get(BreakpointService);
      service.isMedium().subscribe(isMedium => {
        expect(isMedium).toBeFalsy();
        done();
      });
    });
  });

  describe('unsupportedViewPort', () => {
    describe('should return false', () => {
      it('for 599px', async(() => {
        resize(599);
        service = TestBed.get(BreakpointService);
        service
          .unsupportedViewPort()
          .subscribe(value => expect(value).toBe(false));
      }));

      it('above 959px', async(() => {
        resize(960);
        service = TestBed.get(BreakpointService);
        service
          .unsupportedViewPort()
          .subscribe(value => expect(value).toBe(false));
      }));

      it('above 1400px', async(() => {
        resize(700);
        service = TestBed.get(BreakpointService);
        service
          .unsupportedViewPort()
          .subscribe(value => expect(value).toBe(true));
      }));
    });

    describe('should return true', () => {
      it('for 600px', async(() => {
        resize(600);
        service = TestBed.get(BreakpointService);
        service
          .unsupportedViewPort()
          .subscribe(value => expect(value).toBe(true));
      }));

      it('between 600px and 959px', async(() => {
        resize(720);
        service = TestBed.get(BreakpointService);
        service
          .unsupportedViewPort()
          .subscribe(value => expect(value).toBe(true));
      }));

      it('for 959px', async(() => {
        resize(959);
        service = TestBed.get(BreakpointService);
        service
          .unsupportedViewPort()
          .subscribe(value => expect(value).toBe(true));
      }));
    });
  });
});
