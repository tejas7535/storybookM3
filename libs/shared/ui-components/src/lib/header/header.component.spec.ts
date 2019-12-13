import { ChangeDetectionStrategy, SimpleChange } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TranslocoModule } from '@ngneat/transloco';

import { configureTestSuite } from 'ng-bullet';

import { HeaderComponent } from './header.component';

import { VisibilityState } from './enums/visibility-state.enum';

describe('In HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconModule,
        MatToolbarModule,
        FlexLayoutModule,
        TranslocoModule
      ],
      declarations: [HeaderComponent]
    }).overrideComponent(HeaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties and Inputs', () => {
    it('should define the properties', () => {
      expect(component.toggleEnabled).toBeDefined();
      expect(component.platformTitle).toBeUndefined();

      expect(component.toggle).toBeDefined();
    });

    it('should define the default values', () => {
      expect(component.toggleEnabled).toBeFalsy();
    });
  });

  describe('ngOnChanges', () => {
    test('should do nothing when sidebarmode is undefined in changes', () => {
      component['headerVisibility'] = VisibilityState.Hidden;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        sidebarMode: new SimpleChange(0, undefined, false)
      });

      expect(component['headerVisibility']).toBe(VisibilityState.Hidden);
    });

    test('should set headerVisibility when sidebarMode is correct', () => {
      component['headerVisibility'] = VisibilityState.Hidden;
      component.isMobileViewPort = true;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        sidebarMode: new SimpleChange(0, 2, false)
      });

      expect(component['headerVisibility']).toBe(VisibilityState.Visible);
    });

    test('should not set headerVisibility  when sidebarMode is incorrect', () => {
      component['headerVisibility'] = VisibilityState.Hidden;
      component.isMobileViewPort = true;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        sidebarMode: new SimpleChange(0, 1, false)
      });

      expect(component['headerVisibility']).toBe(VisibilityState.Hidden);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should call method observeScrollDirection', () => {
      const spy = spyOn<any>(component, 'observeScrollDirection');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngAfterViewInit();
      component.isMobileViewPort = true;

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe fromSubscription', () => {
      const spy = spyOn<any>(component['subscription'], 'unsubscribe');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('observeScrollDirection()', () => {
    it('should set headerVisibility to visible, when scroll direction is up', fakeAsync(() => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngAfterViewInit();
      component.isMobileViewPort = true;

      Object.defineProperty(window, 'pageYOffset', { value: 21 });
      window.dispatchEvent(new Event('scroll'));
      tick(11);

      Object.defineProperty(window, 'pageYOffset', { value: 20 });
      window.dispatchEvent(new Event('scroll'));
      tick(11);

      expect(component['headerVisibility']).toBe(VisibilityState.Visible);
    }));

    it('should set headerVisibility to hidden, when scroll direction is down', fakeAsync(() => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngAfterViewInit();
      component.isMobileViewPort = true;

      Object.defineProperty(window, 'pageYOffset', { value: 20 });
      window.dispatchEvent(new Event('scroll'));
      tick(11);

      Object.defineProperty(window, 'pageYOffset', { value: 21 });
      window.dispatchEvent(new Event('scroll'));
      tick(11);

      expect(component['headerVisibility']).toBe(VisibilityState.Hidden);
    }));

    it('should not change the visibility if viewport is bigger than 420', fakeAsync(() => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngAfterViewInit();
      component.isMobileViewPort = false;

      Object.defineProperty(window, 'pageYOffset', { value: 20 });
      window.dispatchEvent(new Event('scroll'));
      tick(11);

      Object.defineProperty(window, 'pageYOffset', { value: 21 });
      window.dispatchEvent(new Event('scroll'));
      tick(11);

      expect(component['headerVisibility']).toBe(VisibilityState.Visible);
    }));
  });

  describe('toggleClicked()', () => {
    beforeEach(() => {
      component.toggleEnabled = true;
      fixture.detectChanges();
    });

    it('should be triggered by click at burgerButton', async(() => {
      const burgerButton: Element = Array.from(
        document.querySelectorAll('mat-icon')
      ).find((element: Element) => element.id === 'burger-menu');
      jest.spyOn(component, 'toggleClicked');

      burgerButton.dispatchEvent(new Event('click'));
      expect(component.toggleClicked).toHaveBeenCalled();
    }));

    it('should emit event', () => {
      let eventEmitted = false;
      component.toggle.subscribe(() => (eventEmitted = true));

      component.toggleClicked();
      expect(eventEmitted).toBeTruthy();
    });
  });

  describe('template test', () => {
    it('should display a platformTitle', () => {
      const platformTitle = 'Nebuchadnezzar Shipment';
      component.platformTitle = platformTitle;
      fixture.detectChanges();
      const userMenu = document.querySelector('.schaeffler-h3');
      expect(userMenu.innerHTML).toContain(platformTitle);
    });

    it('should display a burgerMenu', () => {
      let burgerMenu = fixture.debugElement.query(By.css('#burger-menu'));
      expect(burgerMenu).toBeFalsy();
      component.toggleEnabled = true;
      fixture.detectChanges();

      burgerMenu = fixture.debugElement.query(By.css('#burger-menu'));
      expect(burgerMenu.nativeElement).toHaveClass('icon-menu');
    });
  });
});
