import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { HeaderComponent } from './header.component';

describe('In HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        NoopAnimationsModule,
        MatIconModule,
        MatToolbarModule,
        FlexLayoutModule,
      ],
      providers: [provideMockStore()],
    }).overrideComponent(HeaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
      },
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

  describe('ngOnDestroy', () => {
    it('should unsubscribe fromSubscription', () => {
      const spy = spyOn<any>(component['subscription'], 'unsubscribe');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(spy).toHaveBeenCalled();
    });
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
      component.toggle.emit = jest.fn();

      component.toggleClicked();
      expect(component.toggle.emit).toHaveBeenCalled();
    });

    it('should dispatch toogleSidebar Action', () => {
      component['store'].dispatch = jest.fn();

      component.toggleClicked();
      expect(component['store'].dispatch).toHaveBeenCalled();
      expect(component['store'].dispatch).toHaveBeenCalledWith({
        type: '[Sidebar] Toggle Sidebar',
      });
    });
  });

  describe('template test', () => {
    it('should display a platformTitle', () => {
      const platformTitle = 'Nebuchadnezzar Shipment';
      component.platformTitle = platformTitle;
      fixture.detectChanges();
      const userMenu = document.querySelector('h3');
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
