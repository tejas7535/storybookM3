import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { AutoTaggingComponent } from './auto-tagging.component';

import { DataService } from '../../shared/result/data.service';

let dataServiceStub: Partial<DataService>;

dataServiceStub = {
  postTaggingText: jest.fn()
};

describe('AutoTaggingComponent', () => {
  let component: AutoTaggingComponent;
  let fixture: ComponentFixture<AutoTaggingComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: DataService,
          useValue: dataServiceStub
        }
      ],
      declarations: [AutoTaggingComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('it should init form control', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.textFormControl).toBeDefined();
    });
  });

  describe('getTags()', () => {
    test('should call getTags from Service', () => {
      component.textFormControl.setValue('test');

      component.getTags();
      expect(dataServiceStub.postTaggingText).toHaveBeenCalledWith('test');
    });
  });
});
