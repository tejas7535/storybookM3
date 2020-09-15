import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { configureTestSuite } from 'ng-bullet';

import { ResultSectionComponent } from './result-section.component';

describe('resultComponent', () => {
  let component: ResultSectionComponent;
  let fixture: ComponentFixture<ResultSectionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ResultSectionComponent],
      imports: [AgGridModule.withComponents([])],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
