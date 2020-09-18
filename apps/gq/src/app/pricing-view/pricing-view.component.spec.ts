import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';
import { configureTestSuite } from 'ng-bullet';

import { InputSectionModule } from './input-section/input-section.module';
import { PricingViewComponent } from './pricing-view.component';
import { QuerySectionModule } from './query-section/query-section.module';
import { ResultSectionModule } from './result-section/result-section.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('PricingViewComponent', () => {
  let component: PricingViewComponent;
  let fixture: ComponentFixture<PricingViewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        QuerySectionModule,
        ResultSectionModule,
        InputSectionModule,
        provideTranslocoTestingModule({}),
      ],
      declarations: [PricingViewComponent],
      providers: [provideMockStore({})],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingViewComponent);
    component = fixture.debugElement.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
