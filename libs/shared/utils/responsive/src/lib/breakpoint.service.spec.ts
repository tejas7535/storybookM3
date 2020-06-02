import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';

import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { configureTestSuite } from 'ng-bullet';

import { BreakpointService } from './breakpoint.service';

describe('BreakpointService', () => {
  let service: BreakpointService;

  const matchObj = [
    // initially all are false
    { matchStr: '(max-width: 599.99px)', result: false },
    {
      matchStr:
        '(max-width: 599.99px) and (orientation: portrait), (max-width: 959.99px) and (orientation: landscape)',
      result: false,
    },
    {
      matchStr: [
        '(max-width: 599.99px)',
        '(min-width: 600px) and (max-width: 959.99px)',
      ],
      result: false,
    },
    {
      matchStr: '(min-width: 960px) and (max-width: 1279.99px)',
      result: false,
    },
    { matchStr: '(min-width: 600px) and (max-width: 959.99px)', result: false },
    { matchStr: '(min-width: 1920px)', result: false },
  ];

  const resize = (width: number): void => {
    matchObj[0].result = width <= 599; // isMobileViewPort
    matchObj[1].result = width <= 600; // isHandset
    matchObj[2].result = width <= 959; // isLessThanMedium
    matchObj[3].result = width >= 960 && width <= 1279.99; // isMedium
    matchObj[4].result = width >= 600 && width <= 959.99; // unsupportedViewPort
    matchObj[5].result = width >= 1920;
  };

  const fakeObserve = (s: string[] | string): Observable<BreakpointState> =>
    from(matchObj).pipe(
      filter((match) => {
        let isMatch = true;
        if (
          (match.matchStr instanceof Array && !(s instanceof Array)) ||
          (!(match.matchStr instanceof Array) && s instanceof Array)
        ) {
          isMatch = false;
        }
        if (!(match.matchStr instanceof Array)) {
          isMatch = match.matchStr === s;
        } else {
          if (match.matchStr.length !== s.length) {
            isMatch = false;
          } else {
            // tslint:disable-next-line: no-increment-decrement
            for (let i = 0; i < s.length; i++) {
              if (match.matchStr[i] !== s[i]) {
                isMatch = false;
              }
            }
          }
        }

        return isMatch;
      }),
      map(
        // tslint:disable-next-line
        (match) => <BreakpointState>{ matches: match.result, breakpoints: {} }
      )
    );

  const breakpointObserverMock = { observe: jest.fn() };
  breakpointObserverMock.observe.mockImplementation(fakeObserve);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        BreakpointService,
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(BreakpointService);
  });

  test('should be createable', () => {
    expect(service).toBeTruthy();
  });

  describe('isMobileViewPort', () => {
    test('should return true on 400px width', (done) => {
      resize(400);
      service.isMobileViewPort().subscribe((isMobile) => {
        expect(isMobile).toBe(true);
        done();
      });
    });

    test('should return false on 700px width', (done) => {
      resize(700);
      service.isMobileViewPort().subscribe((isMobile) => {
        expect(isMobile).toBe(false);
        done();
      });
    });
  });

  describe('isHandset', () => {
    test('should return true on 400px width', (done) => {
      resize(400);
      service.isHandset().subscribe((isHandset) => {
        expect(isHandset).toBe(true);
        done();
      });
    });

    test('should return false on 960px width', (done) => {
      resize(960);
      service.isHandset().subscribe((isHandset) => {
        expect(isHandset).toBeFalsy();
        done();
      });
    });

    test('should return false on 1000px width', (done) => {
      resize(1000);
      service.isHandset().subscribe((isHandset) => {
        expect(isHandset).toBeFalsy();
        done();
      });
    });
  });

  describe('isLessThanMedium', () => {
    test('should return true on 400px width', (done) => {
      resize(400);
      service.isLessThanMedium().subscribe((isLessThanMedium) => {
        expect(isLessThanMedium).toBeTruthy();
        done();
      });
    });

    test('should return true on 959px width', (done) => {
      resize(959);
      service.isLessThanMedium().subscribe((isLessThanMedium) => {
        expect(isLessThanMedium).toBeTruthy();
        done();
      });
    });

    test('should return false on 960px width', (done) => {
      resize(960);
      service.isLessThanMedium().subscribe((isLessThanMedium) => {
        expect(isLessThanMedium).toBeFalsy();
        done();
      });
    });

    test('should return false on 1000px width', (done) => {
      resize(1000);
      service.isLessThanMedium().subscribe((isLessThanMedium) => {
        expect(isLessThanMedium).toBeFalsy();
        done();
      });
    });
  });

  describe('isMedium', () => {
    test('should return true on 960px width', (done) => {
      resize(960);
      service.isMedium().subscribe((isMedium) => {
        expect(isMedium).toBeTruthy();
        done();
      });
    });

    test('should return false on 1280px width', (done) => {
      resize(1280);
      service.isMedium().subscribe((isMedium) => {
        expect(isMedium).toBeFalsy();
        done();
      });
    });

    test('should return true on 1279px width', (done) => {
      resize(1279);
      service.isMedium().subscribe((isMedium) => {
        expect(isMedium).toBeTruthy();
        done();
      });
    });

    test('should return true on 1000px width', (done) => {
      resize(1000);
      service.isMedium().subscribe((isMedium) => {
        expect(isMedium).toBeTruthy();
        done();
      });
    });

    test('should return false on 1281px width', (done) => {
      resize(1281);
      service.isMedium().subscribe((isMedium) => {
        expect(isMedium).toBeFalsy();
        done();
      });
    });

    test('should return false on 959px width', (done) => {
      resize(959);
      service.isMedium().subscribe((isMedium) => {
        expect(isMedium).toBeFalsy();
        done();
      });
    });
  });

  describe('unsupportedViewPort', () => {
    describe('should return false', () => {
      test('for 599px', (done) => {
        resize(599);
        service.unsupportedViewPort().subscribe((value) => {
          expect(value).toBeFalsy();
          done();
        });
      });

      test('above 959px', (done) => {
        resize(960);
        service.unsupportedViewPort().subscribe((value) => {
          expect(value).toBeFalsy();
          done();
        });
      });

      test('above 1400px', (done) => {
        resize(1401);
        service.unsupportedViewPort().subscribe((value) => {
          expect(value).toBeFalsy();
          done();
        });
      });
    });

    describe('should return true', () => {
      test('for 600px', (done) => {
        resize(600);
        service.unsupportedViewPort().subscribe((value) => {
          expect(value).toBeTruthy();
          done();
        });
      });

      test('between 600px and 959px', (done) => {
        resize(720);
        service.unsupportedViewPort().subscribe((value) => {
          expect(value).toBeTruthy();
          done();
        });
      });

      test('for 959px', (done) => {
        resize(959);
        service.unsupportedViewPort().subscribe((value) => {
          expect(value).toBeTruthy();
          done();
        });
      });
    });
  });

  describe('isDesktop', () => {
    test('should return false on width < 1920', (done) => {
      resize(1919);
      service.isDesktop().subscribe((isDesktop: boolean) => {
        expect(isDesktop).toBeFalsy();
        done();
      });
    });

    test('should return true on width  >= 1920', (done) => {
      resize(1920);
      service.isDesktop().subscribe((isDesktop: boolean) => {
        expect(isDesktop).toBeTruthy();
        done();
      });
    });
  });
});
