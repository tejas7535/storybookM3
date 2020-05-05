import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TestScheduler } from 'rxjs/testing';

import { TranslocoService } from '@ngneat/transloco';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { FunFactsLoadingBarComponent } from './fun-facts-loading-bar.component';
import { FunFactsLoadingBarService } from './fun-facts-loading-bar.service';

describe('FunFactsLoadingBarComponent', () => {
  let component: FunFactsLoadingBarComponent;
  let fixture: ComponentFixture<FunFactsLoadingBarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [FunFactsLoadingBarComponent],
      imports: [
        MatProgressBarModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        provideTranslocoTestingModule({}),
      ],
      providers: [FunFactsLoadingBarService, TranslocoService],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunFactsLoadingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    const expectedFunFact1 = 'abc';
    const expectedFunFact2 = 'abc2';

    it('should define funFacts$ properly', () => {
      const scheduler = new TestScheduler((_actual, _expected) => {
        // expect(actual).toEqual(expected);
      });

      const expectedMarble = '0ms a 7999ms b';
      const expectedValues = {
        a: expectedFunFact1,
        b: expectedFunFact2,
      };

      scheduler
        .expectObservable(component.funFact$)
        .toBe(expectedMarble, expectedValues);
      scheduler.flush();
    });
  });
});
