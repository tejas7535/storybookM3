import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { HeadlineWrapperComponent } from './headline-wrapper.component';

@Component({
  selector: 'schaeffler-dummy-component',
  // tslint:disable-next-line:template-i18n
  template: '<p>test</p>'
})
class DummyComponent {}

const dummyRoutes: Routes = [
  {
    path: 'home',
    component: DummyComponent,
    data: { title: 'TestDummyComponent' }
  }
];

describe('HeadlineWrapperComponent', () => {
  let component: HeadlineWrapperComponent;
  let fixture: ComponentFixture<HeadlineWrapperComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [HeadlineWrapperComponent, DummyComponent],
      imports: [
        RouterTestingModule.withRoutes(dummyRoutes),
        provideTranslocoTestingModule({})
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadlineWrapperComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set a Title', fakeAsync(() => {
      fixture.ngZone.run(() => {
        router.navigate(['/home']);
        tick();

        expect(component.currentRouteTitle).toEqual('TestDummyComponent');
      });
    }));
  });
});
