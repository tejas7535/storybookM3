import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { getItems } from '../../core/store/selectors';
import { SalesTableComponent } from './sales-table.component';

describe('SalesTableComponent', () => {
  let component: SalesTableComponent;
  let fixture: ComponentFixture<SalesTableComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [AgGridModule, CommonModule],
      declarations: [SalesTableComponent],
      providers: [
        provideMockStore({
          initialState: {
            items: [],
          },
          selectors: [
            {
              selector: getItems,
              value: [],
            },
          ],
        }),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.items$).toBeDefined();
    });
  });
});
