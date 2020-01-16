import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import { provideTranslocoTestingModule } from '@schaeffler/shared/transloco';

import { configureTestSuite } from 'ng-bullet';

import { PageNotFoundComponent } from './page-not-found.component';

import * as en from './i18n/de.json';

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent],
      imports: [
        provideTranslocoTestingModule({ 'pageNotFound/en': en }),
        MatButtonModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
