import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ForbiddenComponent } from './forbidden.component';
import * as en from './i18n/de.json';

describe('ForbiddenComponent', () => {
  let component: ForbiddenComponent;
  let fixture: ComponentFixture<ForbiddenComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ForbiddenComponent],
      imports: [
        provideTranslocoTestingModule({ 'forbidden/en': en }),
        MatButtonModule,
        FlexLayoutModule,
        RouterTestingModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
