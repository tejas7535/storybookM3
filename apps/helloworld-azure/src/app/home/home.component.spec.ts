import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';

import { GreetingService } from '../greeting.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let spectator: Spectator<HomeComponent>;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [
      MatProgressBarModule,
      HttpClientTestingModule,
      ReactiveComponentModule,
    ],
    providers: [GreetingService],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    fixture = spectator.fixture;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should render title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h5').textContent).toContain(
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
