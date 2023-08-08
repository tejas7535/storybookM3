import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationResultReportLargeItemsComponent } from './calculation-result-report-large-items.component';

describe('CalculationResultReportLargeItemsComponent', () => {
  let component: CalculationResultReportLargeItemsComponent;
  let fixture: ComponentFixture<CalculationResultReportLargeItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculationResultReportLargeItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      CalculationResultReportLargeItemsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
