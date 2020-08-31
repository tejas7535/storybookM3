import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from 'ng-bullet';

import { InputSectionModule } from './input-section/input-section.module';
import { PricingViewComponent } from './pricing-view.component';
import { QuerySectionModule } from './query-section/query-section.module';
import { ResultSectionModule } from './result-section/result-section.module';

describe('PricingViewComponent', () => {
  let component: PricingViewComponent;
  let fixture: ComponentFixture<PricingViewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        QuerySectionModule,
        ResultSectionModule,
        InputSectionModule,
      ],
      declarations: [PricingViewComponent],
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
