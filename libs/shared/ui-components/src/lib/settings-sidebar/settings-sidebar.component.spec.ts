import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { BreakpointService } from '../breakpoint-service/breakpoint.service';
import { SettingsSidebarComponent } from './settings-sidebar.component';

describe('SettingsSidebarComponent', () => {
  let component: SettingsSidebarComponent;
  let fixture: ComponentFixture<SettingsSidebarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsSidebarComponent],
      imports: [
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        FlexLayoutModule,
        NoopAnimationsModule
      ],
      providers: [BreakpointService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default variables', () => {
    test('default variables for inputs should be set', () => {
      expect(component.open).toBeTruthy();
      expect(component.toggleEnabled).toBeFalsy();
    });

    test('Observable isHandset$ should be defined', async(() => {
      component.isLessThanMedium$.subscribe(val => {
        expect(val).toBeDefined();
      });
    }));
  });

  describe('#onChangeState', () => {
    test('should emit openedChange when called', () => {
      spyOn(component['openedChange'], 'emit');

      component.onChangeState(true);

      expect(component['openedChange'].emit).toHaveBeenCalledWith(true);
    });
  });
});
