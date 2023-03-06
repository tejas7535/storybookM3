import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationRatingComponent } from './quotation-rating.component';

describe('QuotationRatingComponent', () => {
  let component: QuotationRatingComponent;
  let fixture: ComponentFixture<QuotationRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationRatingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
