import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  FooterModule,
  HeaderModule,
  SettingsSidebarModule,
  SidebarModule
} from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';

import { AppComponent } from './app.component';

import { AuthService } from './core/auth.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: AuthService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BreadcrumbModule,
        FooterModule,
        HeaderModule,
        RouterTestingModule,
        SettingsSidebarModule,
        SidebarModule
      ],
      declarations: [AppComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            initAuth: jest.fn()
          }
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(AuthService);
    service.initAuth = jest.fn();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    expect(service.initAuth).toHaveBeenCalled();
  });

  it(`should have as title 'Schaeffler Text Assistant'`, () => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Schaeffler Text Assistant');
  });

  describe('toggleSidebar()', () => {
    test('', () => {
      component.toggleSidebar();
    });
  });

  describe('onChangeSettingsSidebar()', () => {
    test('', () => {
      component.onChangeSettingsSidebar({});
    });
  });
});
