import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Store, StoreModule } from '@ngrx/store';

import { configureTestSuite } from 'ng-bullet';

import { getTranslocoModule } from '../../../shared/transloco/transloco-testing.module';

import { MaterialComponent } from './material.component';

import * as fromStore from '../../../core/store';

describe('MaterialComponent', () => {
  let component: MaterialComponent;
  let fixture: ComponentFixture<MaterialComponent>;
  let store: Store<fromStore.LTPState>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        HttpClientModule,
        getTranslocoModule(),
        StoreModule.forRoot({
          ...fromStore.reducers
        })
      ]
    });
  });

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(MaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a displayFn method that returns accepts an object of type Material but returns its heatTreatement name', () => {
    const mockMaterial = {
      name: 'Makrele',
      heatTreatment: 'Räuchern',
      hardness: 12,
      disabled: false
    };
    expect(component.displayFn).toBeDefined();
    expect(component.displayFn()).toBe(undefined);
    expect(component.displayFn(mockMaterial)).toBe('Räuchern');
  });

  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
