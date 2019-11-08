import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  FooterModule,
  HeaderModule,
  ScrollToTopModule,
  SnackBarModule
} from '@schaeffler/shared/ui-components';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        FooterModule,
        ScrollToTopModule,
        SnackBarModule,
        RouterTestingModule,
        HeaderModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should log to console when logoutUser is triggered', () => {
    jest.spyOn(console, 'log');
    component.logoutUser();
    expect(console.log).toHaveBeenCalled();
  });

  it('should log to console when toggleSidebar is triggered', () => {
    jest.spyOn(console, 'log');
    component.toggleSidebar();
    expect(console.log).toHaveBeenCalled();
  });
});
