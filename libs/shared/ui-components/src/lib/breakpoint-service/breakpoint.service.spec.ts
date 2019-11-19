import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { async, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';
import { from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { BreakpointService } from './breakpoint.service';

describe('BreakpointService', () => {
  let service: BreakpointService;

  const matchObj = [
    // initially all are false
    { matchStr: '(max-width: 599px)', result: false },
    { matchStr: '(min-width: 600px)', result: false },
    { matchStr: '(max-width: 959px)', result: false }
  ];

  const resize = (width: number): void => {
    matchObj[0].result = width <= 599;
    matchObj[1].result = width >= 600;
    matchObj[2].result = width <= 959;
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

  it('should be createable', () => {
    service = TestBed.get(BreakpointService);
    expect(service).toBeTruthy();
  });

  describe('isMobileViewPort', () => {
    it('should return true on 400px width', async(() => {
      resize(400);
      service = TestBed.get(BreakpointService);
      service
        .isMobileViewPort()
        .subscribe(isMobile => expect(isMobile).toBe(true));
    }));

    it('should return false on 700px width', async(() => {
      resize(700);
      service = TestBed.get(BreakpointService);
      service
        .isMobileViewPort()
        .subscribe(isMobile => expect(isMobile).toBe(false));
    }));
  });

  describe('isHandset', () => {
    it('should return true on 400px width', async(() => {
      resize(400);
      service = TestBed.get(BreakpointService);
      service.isHandset().subscribe(isHandset => expect(isHandset).toBe(true));
    }));

    it('should return true on 960px width', async(() => {
      resize(960);
      service = TestBed.get(BreakpointService);
      service.isHandset().subscribe(isHandset => expect(isHandset).toBe(true));
    }));

    it('should return true on 1000px width', async(() => {
      resize(1000);
      service = TestBed.get(BreakpointService);
      service.isHandset().subscribe(isHandset => expect(isHandset).toBe(false));
    }));
  });

  describe('isLessThanMedium', () => {
    it('should return true on 400px width', async(() => {
      resize(400);
      service = TestBed.get(BreakpointService);
      service
        .isLessThanMedium()
        .subscribe(isLessThanMedium => expect(isLessThanMedium).toBe(true));
    }));

    it('should return true on 960px width', async(() => {
      resize(960);
      service = TestBed.get(BreakpointService);
      service
        .isLessThanMedium()
        .subscribe(isLessThanMedium => expect(isLessThanMedium).toBe(true));
    }));

    it('should return true on 1000px width', async(() => {
      resize(1000);
      service = TestBed.get(BreakpointService);
      service
        .isLessThanMedium()
        .subscribe(isLessThanMedium => expect(isLessThanMedium).toBe(false));
    }));
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
