import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import { configureTestSuite } from 'ng-bullet';

import { LandingComponent } from './landing.component';

import { AuthService } from '../../core/auth.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule],
      declarations: [LandingComponent],
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
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    test('should call login of service with targetUrl when hash avl', () => {
      location.hash = '#/tagging';
      component['authService'].login = jest.fn();

      component.login();

      expect(component['authService'].login).toHaveBeenCalledWith('tagging');
    });

    test('should call login of service hash url when hash valid angular routing', () => {
      location.hash = 'soeinquatsch/#/tagging';
      component['authService'].login = jest.fn();

      component.login();

      expect(component['authService'].login).toHaveBeenCalledWith('/');
    });
  });
});
