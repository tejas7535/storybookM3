import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { SidebarMode } from './sidebar-mode.enum';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  const matchObj = [
    // initially all are false
    { matchStr: '(min-width: 1024px)', result: false },
    { matchStr: '(min-width: 1366px)', result: false },
    { matchStr: '(max-width: 1366px)', result: false }
  ];

  const resize = (width: number): void => {
    matchObj[0].result = width >= 1024;
    matchObj[1].result = width >= 1366;
    matchObj[2].result = width <= 1366;
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [SidebarService]
    });
  });

  it('should be created', () => {
    service = TestBed.get(SidebarService);
    expect(service).toBeTruthy();
  });

  describe('getSidebarMode()', () => {
    it('should return Observable<SidebarMode>', () => {
      resize(1000);
      service = TestBed.get(SidebarService);
      service.getSidebarMode().subscribe(mode => {
        expect(
          Object.values(SidebarMode).includes(SidebarMode[mode])
        ).toBeTruthy();
      });
    });

    it('should return SidebarMode.Closed', () => {
      resize(600);
      service = TestBed.get(SidebarService);
      service
        .getSidebarMode()
        .subscribe(mode => expect(mode).toBe(SidebarMode.Closed));
    });

    it('should return SidebarMode.Minified', () => {
      resize(1200);
      service = TestBed.get(SidebarService);
      service
        .getSidebarMode()
        .subscribe(mode => expect(mode).toBe(SidebarMode.Minified));
    });

    it('should return SidebarMode.Open', () => {
      resize(2000);
      service = TestBed.get(SidebarService);
      service
        .getSidebarMode()
        .subscribe(mode => expect(mode).toBe(SidebarMode.Open));
    });
  });
});
