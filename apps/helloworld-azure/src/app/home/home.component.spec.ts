import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { configureTestSuite } from 'ng-bullet';

import { GreetingService } from '../greeting.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatProgressBarModule, HttpClientTestingModule],
      declarations: [HomeComponent],
      providers: [GreetingService],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should render title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain(
      'Here are some links to help you start:'
    );
  });

  describe('ngOnInit', () => {
    test('should call greetingService', () => {
      component['greetingsService'].greetPublic = jest.fn();
      component['greetingsService'].greetAdmins = jest.fn();
      component['greetingsService'].greetAuthorized = jest.fn();
      component['greetingsService'].greetUsers = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component['greetingsService'].greetPublic).toHaveBeenCalled();
      expect(component['greetingsService'].greetAdmins).toHaveBeenCalled();
      expect(component['greetingsService'].greetAuthorized).toHaveBeenCalled();
      expect(component['greetingsService'].greetUsers).toHaveBeenCalled();
    });
  });
});
