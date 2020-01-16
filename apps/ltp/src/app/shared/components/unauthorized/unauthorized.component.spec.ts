import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { UnauthorizedComponent } from './unauthorized.component';

import * as en from '../../../../assets/i18n/en.json';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UnauthorizedComponent],
      imports: [
        provideTranslocoTestingModule({ en }),
        MatGridListModule,
        MatButtonModule,
        RouterTestingModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the required variables and use them', () => {
    expect(component.mailto).toBeTruthy();
    expect(component.subject).toBeTruthy();
    expect(component.body).toBeTruthy();
    expect(component.href).toBeTruthy();

    expect(component.href).toContain(component.mailto);
    expect(component.href).toContain(component.subject);
    expect(component.href).toContain(component.body);
  });
});
