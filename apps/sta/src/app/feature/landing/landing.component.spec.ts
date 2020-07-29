import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { startLoginFlow } from '@schaeffler/auth';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule],
      declarations: [LandingComponent],
      providers: [provideMockStore()],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(store).toBeTruthy();
  });

  describe('login', () => {
    test('should dispatch loginFlow and set local storage', () => {
      store.dispatch = jest.fn();

      component.login();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(startLoginFlow());
      expect(localStorage.getItem('alreadyVisited')).toEqual('TRUE');
    });
  });
});
