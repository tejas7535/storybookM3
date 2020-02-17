import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { configureTestSuite } from 'ng-bullet';

describe('AppComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent]
    });
  });

  test('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test(`should have as title 'cdba'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('cdba');
  });

  test('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to cdba!'
    );
  });
});
