import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';

import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { configureTestSuite } from 'ng-bullet';

import { SidebarMode, Viewport } from './models';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  const matchObj = [
    // initially all are false
    {
      matchStr: [
        '(max-width: 599.99px)',
        '(min-width: 600px) and (max-width: 959.99px)',
      ],
      result: false,
    },
    {
      matchStr: [
        '(min-width: 1280px) and (max-width: 1919.99px)',
        '(min-width: 1920px)',
      ],
      result: false,
    },
    {
      matchStr: '(min-width: 960px) and (max-width: 1279.99px)',
      result: false,
    },
  ];

  const resize = (width: number): void => {
    matchObj[0].result = width <= 959.99;
    matchObj[1].result = width >= 1280;
    matchObj[2].result = width >= 960 && width <= 1279.99;
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
        SidebarService,
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(SidebarService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSidebarMode()', () => {
    test('should return SidebarMode.Closed for width 600px', (done) => {
      resize(600);
      service.getSidebarMode().subscribe((mode) => {
        expect(mode).toBe(SidebarMode.Closed);
        done();
      });
    });

    test('should return SidebarMode.Closed for width 959px', (done) => {
      resize(959);
      service.getSidebarMode().subscribe((mode) => {
        expect(mode).toBe(SidebarMode.Closed);
        done();
      });
    });

    test('should return SidebarMode.Closed for width 400px', (done) => {
      resize(400);
      service.getSidebarMode().subscribe((mode) => {
        expect(mode).toBe(SidebarMode.Closed);
        done();
      });
    });

    test('should return SidebarMode.Minified for width 960px', (done) => {
      resize(960);
      service.getSidebarMode().subscribe((mode) => {
        expect(mode).toBe(SidebarMode.Minified);
        done();
      });
    });

    test('should return SidebarMode.Minified for width 1279px', (done) => {
      resize(1279);
      service.getSidebarMode().subscribe((mode) => {
        expect(mode).toBe(SidebarMode.Minified);
        done();
      });
    });

    test('should return SidebarMode.Open for width 1280px', (done) => {
      resize(1280);
      service.getSidebarMode().subscribe((mode) => {
        expect(mode).toBe(SidebarMode.Open);
        done();
      });
    });
  });

  describe('getViewport()', () => {
    test('should return Viewport.Small for width 600px', (done) => {
      resize(600);
      service.getViewport().subscribe((viewport) => {
        expect(viewport).toBe(SidebarMode.Closed);
        done();
      });
    });

    test('should return Viewport.Small for width 959px', (done) => {
      resize(959);
      service.getViewport().subscribe((mode) => {
        expect(mode).toBe(SidebarMode.Closed);
        done();
      });
    });

    test('should return Viewport.Small for width 400px', (done) => {
      resize(400);
      service.getViewport().subscribe((mode) => {
        expect(mode).toBe(SidebarMode.Closed);
        done();
      });
    });

    test('should return Viewport.Medium for width 960px', (done) => {
      resize(960);
      service.getViewport().subscribe((mode) => {
        expect(mode).toBe(Viewport.Medium);
        done();
      });
    });

    test('should return Viewport.Medium for width 1279px', (done) => {
      resize(1279);
      service.getViewport().subscribe((mode) => {
        expect(mode).toBe(Viewport.Medium);
        done();
      });
    });

    test('should return Viewport.Large for width 1280px', (done) => {
      resize(1280);
      service.getViewport().subscribe((mode) => {
        expect(mode).toBe(Viewport.Large);
        done();
      });
    });
  });
});
