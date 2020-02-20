import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SnackBarModule } from '@schaeffler/shared/ui-components';

import { configureTestSuite } from 'ng-bullet';

import { GhostLineElementsModule } from '../../ghost-elements/ghost-line-elements.module';

import { ResultAutoTaggingComponent } from './result-auto-tagging.component';

import { DataStoreService } from '../services/data-store.service';

describe('ResultAutoTaggingComponent', () => {
  let component: ResultAutoTaggingComponent;
  let fixture: ComponentFixture<ResultAutoTaggingComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        SnackBarModule,
        NoopAnimationsModule,
        GhostLineElementsModule,
        HttpClientTestingModule
      ],
      declarations: [ResultAutoTaggingComponent],
      providers: [DataStoreService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultAutoTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOniInit', () => {
    test('should define observable', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();
      expect(component.loadingTags$).toBeDefined();
    });
  });

  describe('ngOnChanges', () => {
    test('should do nothing when tags did not change', () => {
      const test = ['test'];
      component.subsetTags = test;
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({});

      expect(component.subsetTags).toEqual(test);
    });

    test('should set showMoreTagsBtnDisabled to false when more than 20 tags initially avl', () => {
      const test = ['test'];
      const newTags = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18'
      ];
      component.subsetTags = test;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        tags: {
          previousValue: [],
          currentValue: newTags,
          isFirstChange: () => false,
          firstChange: false
        }
      });

      expect(component.showMoreTagsBtnDisabled).toBeFalsy();
    });

    test('should set showMoreTagsBtnDisabled to true when less than 15 tags initially avl', () => {
      const test = ['test'];
      const newTags = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14'
      ];
      component.subsetTags = test;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        tags: {
          previousValue: [],
          currentValue: newTags,
          isFirstChange: () => false,
          firstChange: false
        }
      });

      expect(component.showMoreTagsBtnDisabled).toBeTruthy();
    });

    test('should set showMoreTagsBtnDisabled to false when more than 15 tags initially avl', () => {
      const test = ['test'];
      const newTags = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16'
      ];
      component.subsetTags = test;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        tags: {
          previousValue: [],
          currentValue: newTags,
          isFirstChange: () => false,
          firstChange: false
        }
      });

      expect(component.showMoreTagsBtnDisabled).toBeFalsy();
    });

    test('should set subsetTags on tags change to MIN', () => {
      const test = ['test'];
      const newTags = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17'
      ];
      component.subsetTags = test;

      component.showMoreTagsBtnDisabled = false;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        tags: {
          previousValue: [],
          currentValue: newTags,
          isFirstChange: () => false,
          firstChange: false
        }
      });

      expect(component.subsetTags).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15'
      ]);
    });

    test('should reset subsetTags when tags are resetted', () => {
      component.subsetTags = [];

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges({
        tags: {
          previousValue: [],
          currentValue: undefined,
          isFirstChange: () => false,
          firstChange: false
        }
      });

      expect(component.subsetTags).toBeUndefined();
    });
  });

  describe('add', () => {
    test('should push value when value is part of event', () => {
      component.subsetTags = [];
      component.add(({ value: 'test ' } as unknown) as MatChipInputEvent);

      expect(component.subsetTags[component.subsetTags.length - 1]).toEqual(
        'test'
      );
    });

    test('should reset input when input is part of event', () => {
      const evt = ({
        input: { value: 'top' }
      } as unknown) as MatChipInputEvent;
      component.add(evt);

      expect(evt.input.value).toEqual('');
    });
  });

  describe('remove()', () => {
    test('it should remove tag from tags', () => {
      const tag = 'apple';
      const tags = ['cucumber', 'banana', 'apple', 'orange'];

      component.subsetTags = tags;

      component.remove(tag);

      expect(component.subsetTags).toEqual(['cucumber', 'banana', 'orange']);
    });
  });

  describe('copyToClipBoard', () => {
    test('it should copy text to clip board', () => {
      component.subsetTags = ['test'];
      component['document'].execCommand = jest.fn();
      component.copyToClipBoard();

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

  describe('showMoreTags', () => {
    let allTags: string[];

    beforeEach(() => {
      component.showMoreTagsBtnDisabled = false;
      allTags = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17'
      ];
      component.tags = allTags;
      component.subsetTags = [];
    });

    test('should set showMoreTagsBtnDisabled to true', () => {
      component.showMoreTags();

      expect(component.showMoreTagsBtnDisabled).toBeTruthy();
    });

    test('should slice tags correctly when tags > min_tags', () => {
      component.showMoreTags();

      expect(component.subsetTags).toEqual(['15', '16', '17']);
    });

    test('should not add already existing tags', () => {
      component.subsetTags = ['16'];
      component.showMoreTags();

      expect(component.subsetTags).toEqual(['16', '15', '17']);
    });

    test('should not change subset when tags <= MIN_TAGS', () => {
      component.subsetTags = ['13'];
      component.tags = ['13'];

      component.showMoreTags();

      expect(component.subsetTags).toEqual(['13']);
    });
  });
});
