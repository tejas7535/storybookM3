import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridListModule } from '@angular/material';

import { configureTestSuite } from 'ng-bullet';

import { getTranslocoModule } from '../../transloco/transloco-testing.module';

import { SignedoutComponent } from './signedout.component';

describe('SignedoutComponent', () => {
  let component: SignedoutComponent;
  let fixture: ComponentFixture<SignedoutComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SignedoutComponent],
      imports: [HttpClientModule, MatGridListModule, getTranslocoModule()]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignedoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
