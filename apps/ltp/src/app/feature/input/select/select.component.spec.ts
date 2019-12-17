import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { getTranslocoModule } from '../../../shared/transloco/transloco-testing.module';

import { SelectComponent } from './select.component';

import { SelectControl } from './select-control.model';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SelectComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        NoopAnimationsModule,
        FlexLayoutModule,
        getTranslocoModule()
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.control = new SelectControl({
      key: 'test',
      name: 'TEST',
      disabled: false,
      formControl: new FormControl(),
      options: of([
        { value: 'testOption', name: 'TESTOPTION' },
        { value: 'testOption2', name: 'TESTOPTION2' }
      ])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
