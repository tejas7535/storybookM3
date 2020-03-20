import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { IconModule } from '../icon/icon.module';

import { SidebarComponent } from './sidebar.component';

import { SidebarMode } from './sidebar-mode.enum';

import { SidebarElement } from './sidebar-element';
import { SIDEBAR_ELEMENTS_MOCK } from './sidebar-elements.mock';

describe('In SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [
        IconModule,
        NoopAnimationsModule,
        MatSidenavModule,
        MatTooltipModule,
        NoopAnimationsModule,
        RouterTestingModule,
        provideTranslocoTestingModule({})
      ]
    }).overrideComponent(SidebarComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Variables', () => {
    it('should define the properties', () => {
      expect(component.width).toEqual(260);
      expect(component.mode).toBeUndefined();
      expect(component.elements).toBeUndefined();
    });
  });

  describe('template test', () => {
    beforeEach(() => {
      component.elements = SIDEBAR_ELEMENTS_MOCK;
      fixture.detectChanges();
    });

    describe('should show sidebar-items', () => {
      it('by given sidebar-elements', () => {
        const sidebarItems: NodeListOf<Element> = document.querySelectorAll(
          '.sidebar-item'
        );
        expect(sidebarItems.length).toEqual(SIDEBAR_ELEMENTS_MOCK.length);
      });

      it('with sidebar-items', () => {
        let sidebarIcon: Element;

        SIDEBAR_ELEMENTS_MOCK.forEach((sidebarElement: SidebarElement) => {
          sidebarIcon = Array.from(document.querySelectorAll('mat-icon')).find(
            (element: Element) => element.innerHTML === sidebarElement.icon.icon
          );
          expect(sidebarIcon).not.toBeNull();
        });
      });
    });

    it('sidebar-mode should toggle minified css-class in mat-sidenav and item-wrapper', () => {
      const sidebar = document.querySelector('.sidebar');
      // if it woks for one item, it works for the other ones
      const sidebarItemWrapper = document.querySelector(
        '.sidebar-item-wrapper'
      );
      const className = 'minified';

      component.mode = SidebarMode.Closed;
      fixture.detectChanges();
      expect(sidebar.className).not.toContain(className);
      expect(sidebarItemWrapper.className).not.toContain(className);

      component.mode = SidebarMode.Open;
      fixture.detectChanges();
      expect(sidebar.className).not.toContain(className);
      expect(sidebarItemWrapper.className).not.toContain(className);

      component.mode = SidebarMode.Minified;
      fixture.detectChanges();
      expect(sidebar.className).toContain(className);
      expect(sidebarItemWrapper.className).toContain(className);
    });

    describe('should set sidebar-item text', () => {
      it('into headline-item', () => {
        component.elements = SIDEBAR_ELEMENTS_MOCK;
        component.mode = SidebarMode.Open;
        fixture.detectChanges();

        const headlines = document.querySelectorAll('.sidebar h4');
        expect(headlines.length).toBeGreaterThan(0);

        for (let i = 0; i < headlines.length; i += 1) {
          expect(headlines.item(i).textContent).toContain(
            SIDEBAR_ELEMENTS_MOCK[i].text
          );
        }
      });
    });
  });

  describe('sidebarAnimation()', () => {
    it('should animate with minify-mode if sidebar is minified', () => {
      component.mode = SidebarMode.Minified;
      component.isMobileViewPort = false;
      const expected = {
        value: 'minify',
        params: {
          width: `${component.width}px`
        }
      };
      const animationStyle = component.sidebarAnimation;

      expect(animationStyle).toEqual(expected);
    });

    it('should animate with open-mode if sidebar is open or closed', () => {
      component.mode = SidebarMode.Open;
      component.isMobileViewPort = false;
      const expected = {
        value: 'open',
        params: {
          width: `${component.width}px`
        }
      };
      let animationStyle = component.sidebarAnimation;
      expect(animationStyle).toEqual(expected);

      component.mode = SidebarMode.Closed;
      animationStyle = component.sidebarAnimation;
      expect(animationStyle).toEqual(expected);
    });

    it('should set sidebar width to 100 % if mobileViewPort is active', () => {
      component.mode = SidebarMode.Minified;
      component.isMobileViewPort = true;
      const expected = {
        value: 'minify',
        params: {
          width: '100%'
        }
      };
      const animationStyle = component.sidebarAnimation;

      expect(animationStyle).toEqual(expected);
    });
  });

  describe('contentAnimation()', () => {
    it('should animate with minify-mode if sidebar is minified', () => {
      component.mode = SidebarMode.Minified;
      const expected = {
        value: 'minify'
      };
      const animationStyle = component.contentAnimation;

      expect(animationStyle).toEqual(expected);
    });

    it('should animate with open-mode if sidebar is open or close', () => {
      component.mode = SidebarMode.Open;
      const expectedOpen = {
        value: 'open',
        params: {
          margin_left: `${component.width}px`
        }
      };
      let animationStyle = component.contentAnimation;
      expect(animationStyle).toEqual(expectedOpen);

      component.mode = SidebarMode.Closed;
      animationStyle = component.contentAnimation;
      expect(animationStyle).toEqual(expectedOpen);
    });
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
