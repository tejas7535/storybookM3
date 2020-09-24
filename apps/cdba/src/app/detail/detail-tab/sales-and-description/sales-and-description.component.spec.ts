import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { MaterialNumberModule } from '../../../shared/pipes';
import { SalesAndDescriptionComponent } from './sales-and-description.component';

describe('SalesAndDescriptionComponent', () => {
  let component: SalesAndDescriptionComponent;
  let fixture: ComponentFixture<SalesAndDescriptionComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({}), MaterialNumberModule],
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
