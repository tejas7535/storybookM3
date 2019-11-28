import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { AutoTaggingComponent } from './auto-tagging.component';

import { TaggingService } from './tagging.service';

import { InputText } from './models';

let taggingServiceStub: Partial<TaggingService>;

taggingServiceStub = {
  getTags: jest.fn(() => of(['This', 'is', 'a', 'test']))
};

describe('AutoTaggingComponent', () => {
  let component: AutoTaggingComponent;
  let fixture: ComponentFixture<AutoTaggingComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: TaggingService,
          useValue: taggingServiceStub
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
      component.getTags();

      expect(component.tags$).toBeDefined();
      expect(component['taggingService'].getTags).toHaveBeenCalledWith(
        new InputText(component.textFormControl.value)
      );
    });
  });

  describe('remove()', () => {
    test('it should remove tag from tags', () => {
      const tag = 'apple';
      const tags = ['cucumber', 'banana', 'apple', 'orange'];
      const tags$ = of(tags);
      component.tags$ = tags$;

      component.remove(tags, tag);

      component.tags$.subscribe(res =>
        expect(res).toEqual(tags.filter(t => t !== tag))
      );
    });
  });

  describe('copyToClipBoard', () => {
    test('it should copy text to clip board', () => {
      component['document'].execCommand = jest.fn();
      component.copyToClipBoard(['test']);

      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
