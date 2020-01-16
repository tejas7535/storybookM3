import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { FooterModule, HeaderModule } from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { AppComponent } from './app.component';

import { GreetingService } from './greeting.service';

describe('AppComponent', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HeaderModule,
        FooterModule,
        MatProgressBarModule,
        HttpClientTestingModule
      ],
      providers: [GreetingService],
      declarations: [AppComponent]
    });
  });

  test('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  test(`should have as title 'helloworld-azure'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.platformTitle).toEqual('Hello World Azure');
  });

  test('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain(
      'Here are some links to help you start:'
    );
  });
});
