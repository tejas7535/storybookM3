import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { clearRowData } from '../../../core/store';
import { ResetAllButtonComponent } from './reset-all-button.component';

describe('ResetAllButtonComponent', () => {
  let component: ResetAllButtonComponent;
  let fixture: ComponentFixture<ResetAllButtonComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ResetAllButtonComponent],
      imports: [
        CommonModule,
        SharedTranslocoModule,
        MatButtonModule,
        MatIconModule,
        ReactiveComponentModule,
      ],
      providers: [provideMockStore({})],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetAllButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockStore = TestBed.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('resetAll', () => {
    test('should dispatch action', () => {
      mockStore.dispatch = jest.fn();
      component.resetAll();
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearRowData());
    });
  });
});
