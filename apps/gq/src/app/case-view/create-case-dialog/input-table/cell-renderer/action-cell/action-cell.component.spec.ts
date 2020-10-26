import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { deleteRowDataItem } from '../../../../../core/store';
import { ActionCellComponent } from './action-cell.component';

describe('ActionCellComponent', () => {
  let component: ActionCellComponent;
  let fixture: ComponentFixture<ActionCellComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ActionCellComponent],
      imports: [MatIconModule],
      providers: [provideMockStore({})],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockStore = TestBed.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      const params: any = {
        test: '123',
      };
      component.agInit(params);

      expect(component.params).toEqual(params);
    });
  });

  describe('deleteItem', () => {
    test('should dispatch action', () => {
      mockStore.dispatch = jest.fn();

      component.params = {
        data: {
          materialNumber: '1234',
        },
      };

      component.deleteItem();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        deleteRowDataItem({ materialNumber: '1234' })
      );
    });
  });
});
