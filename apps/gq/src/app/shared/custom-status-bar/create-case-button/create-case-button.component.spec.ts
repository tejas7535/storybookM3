import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CreateCaseButtonComponent } from './create-case-button.component';

describe('CreateCaseButtonComponent', () => {
  let component: CreateCaseButtonComponent;
  let fixture: ComponentFixture<CreateCaseButtonComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCaseButtonComponent],
      imports: [
        CommonModule,
        SharedTranslocoModule,
        MatButtonModule,
        ReactiveComponentModule,
      ],
      providers: [provideMockStore({})],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCaseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
