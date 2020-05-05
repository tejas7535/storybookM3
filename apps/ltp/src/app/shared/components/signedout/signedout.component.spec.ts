import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridListModule } from '@angular/material/grid-list';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../../../assets/i18n/en.json';
import { SignedoutComponent } from './signedout.component';

describe('SignedoutComponent', () => {
  let component: SignedoutComponent;
  let fixture: ComponentFixture<SignedoutComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SignedoutComponent],
      imports: [
        HttpClientModule,
        MatGridListModule,
        provideTranslocoTestingModule({ en }),
      ],
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
