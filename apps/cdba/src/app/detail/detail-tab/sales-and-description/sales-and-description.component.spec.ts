import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SalesAndDescriptionComponent } from './sales-and-description.component';

describe('SalesAndDescriptionComponent', () => {
  let component: SalesAndDescriptionComponent;
  let fixture: ComponentFixture<SalesAndDescriptionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({})],
      declarations: [SalesAndDescriptionComponent],
      providers: [],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesAndDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
