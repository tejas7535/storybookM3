import { BehaviorSubject } from 'rxjs';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterEvent
} from '@angular/router';

import { configureTestSuite } from 'ng-bullet';

import { BreadcrumbComponent } from './breadcrumb.component';

import { BreadcrumbItem } from './models/breadcrumb-item.model';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  const eventsStub = new BehaviorSubject<RouterEvent>(undefined);
  const routerStub = {
    events: eventsStub,
    createUrlTree: (_commands, _navExtras = {}) => {},
    serializeUrl: (url: string) => url,
    routerState: {
      snapshot: {
        url: 'test url'
      }
    }
  };

  const activatedRouteStub = {
    firstChild: {
      firstChild: {
        outlet: PRIMARY_OUTLET,
        snapshot: {
          data: {
            breadcrumb: 'test label'
          }
        }
      }
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      declarations: [BreadcrumbComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    test('should call handleActiveRoute', () => {
      component['handleActiveRoute'] = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['handleActiveRoute']).toHaveBeenCalledWith();
    });
  });

  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });

  describe('handleActiveRoute()', () => {
    test('should add active route if not home', async(() => {
      component['handleActiveRoute']();

      routerStub.events.next(new NavigationEnd(1, 'test', 'test'));

      expect(component.breadcrumb).toEqual([
        new BreadcrumbItem('test url', 'test label')
      ]);
    }));

    test('should not add breadcrumb when on home', async(() => {
      component.home = 'test url';
      component['handleActiveRoute']();

      routerStub.events.next(new NavigationEnd(1, 'test', 'test'));

      expect(component.breadcrumb).toEqual([]);
    }));
  });
});
