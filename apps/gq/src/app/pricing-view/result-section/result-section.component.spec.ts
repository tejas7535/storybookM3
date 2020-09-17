import { AgGridModule } from '@ag-grid-community/angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';
import { configureTestSuite } from 'ng-bullet';

import { ResultSectionComponent } from './result-section.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('resultComponent', () => {
  let component: ResultSectionComponent;
  let fixture: ComponentFixture<ResultSectionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ResultSectionComponent],
      imports: [
        AgGridModule.withComponents([]),
        provideTranslocoTestingModule({}),
      ],
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
