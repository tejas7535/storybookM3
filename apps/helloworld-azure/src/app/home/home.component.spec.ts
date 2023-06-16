import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture } from '@angular/core/testing';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { GreetingService } from '../greeting.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let spectator: Spectator<HomeComponent>;
  let service: GreetingService;

  const createComponent = createComponentFactory({
    component: HomeComponent,
    imports: [MatProgressBarModule, HttpClientTestingModule, PushPipe],
    providers: [
      GreetingService,
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    fixture = spectator.fixture;
    service = spectator.inject(GreetingService);
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
      service.greetPublic = jest.fn();
      service.greetAdmins = jest.fn();
      service.greetAuthorized = jest.fn();
      service.greetUsers = jest.fn();
      service.greetDotNetAuthorized = jest.fn();
      service.greetDotNetPublic = jest.fn();

      component.ngOnInit();

      expect(service.greetPublic).toHaveBeenCalled();
      expect(service.greetAdmins).toHaveBeenCalled();
      expect(service.greetAuthorized).toHaveBeenCalled();
      expect(service.greetUsers).toHaveBeenCalled();
      expect(service.greetDotNetAuthorized).toHaveBeenCalled();
      expect(service.greetDotNetPublic).toHaveBeenCalled();
    });
  });
});
