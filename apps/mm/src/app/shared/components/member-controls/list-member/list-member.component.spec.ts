import {
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { of, Subject } from 'rxjs';

import {
  BearinxListValue,
  CONTROL_META,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';
import { MmHostMappingPipe } from '@mm/shared/pipes/mm-host-mapping.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import {
  PictureCardActionComponent,
  PictureCardComponent,
} from '@schaeffler/picture-card';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MagneticSliderComponent } from '../../magnetic-slider/magnetic-slider.component';
import { MemberTypes } from './../../../constants/dialog-constant';
import { MaterialModule } from './../../../material.module';
import { PictureCardListComponent } from './../picture-card-list/picture-card-list.component';
import { SelectMemberComponent } from './../select-member/select-member.component';
import { ListMemberComponent } from './list-member.component';
import { ListMember } from './list-member.model';

describe('ListMemberComponent', () => {
  let component: ListMemberComponent;
  let spectator: Spectator<ListMemberComponent>;

  const createComponent = createComponentFactory({
    component: ListMemberComponent,
    imports: [
      PushPipe,
      MaterialModule,
      SelectModule,
      ReactiveFormsModule,
      MockPipe(MmHostMappingPipe, () => 'mocked'),
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [
      ListMemberComponent,
      SelectMemberComponent,
      PictureCardComponent,
      PictureCardListComponent,
      PictureCardActionComponent,
      MagneticSliderComponent,
    ],
    providers: [
      {
        provide: CONTROL_META,
        useValue: {
          member: {},
          listValues$: of([]),
          page: { id: 'some page id' },
        } as VariablePropertyMeta,
      },
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: PictureCardListComponent,
        multi: true,
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should set isBoolean for boolean type', () => {
      component['setupOptions'] = jest.fn();
      component['connectRuntime'] = jest.fn();
      component['meta'].member = {
        ...component['meta'].member,
        type: MemberTypes.Boolean,
      };

      component.ngOnInit();

      expect(component.isBoolean).toEqual(true);
      expect(component['setupOptions']).not.toHaveBeenCalled();
      expect(component['connectRuntime']).not.toHaveBeenCalled();
    });
    it('should set isPictureList for pictureList type', (done) => {
      component['setupOptions'] = jest.fn();
      component['connectRuntime'] = jest.fn();
      component['meta'].member = {
        ...component['meta'].member,
        type: MemberTypes.LazyList,
      };
      const mockListValues = of([
        {
          imageUrl: 'the url',
        } as BearinxListValue,
      ]);
      component['meta'].listValues$ = mockListValues;

      component.ngOnInit();

      component.isPictureList$.subscribe((isPictureList: boolean) => {
        expect(isPictureList).toEqual(true);
        done();
      });

      expect(component['setupOptions']).toHaveBeenCalledWith(mockListValues);
      expect(component['connectRuntime']).toHaveBeenCalled();
    });
    it('should call setupOptions and connectRuntime for list types', (done) => {
      const mockedFormControl = new FormControl();
      const mockedFormGroup = new FormGroup({ value: mockedFormControl });
      component['setupOptions'] = jest.fn();
      component['connectRuntime'] = jest.fn();
      component['meta'].member = {
        ...component['meta'].member,
        type: MemberTypes.LazyList,
      };
      component['meta'].control = mockedFormGroup;

      component['meta'].listValues$ = undefined;

      component.ngOnInit();

      component.isPictureList$.subscribe((isPictureList: boolean) => {
        expect(isPictureList).toEqual(false);
        done();
      });

      expect(component['setupOptions']).toHaveBeenCalled();
      expect(component['connectRuntime']).toHaveBeenCalled();
    });
  });
  describe('#ngOnDestroy', () => {
    it('should call next and complete of destroy$', () => {
      component['destroy$'].next = jest.fn();
      component['destroy$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
  describe('#isDropdownInput', () => {
    it('should return false for types other than lazy lists', () => {
      const result = component.isDropdownInput('not a lazy list', 'any id');

      expect(result).toEqual(false);
    });

    it('should return false for lazy list with excluded id', () => {
      const result = component.isDropdownInput(
        MemberTypes.LazyList,
        'IDMM_MEASSURING_METHOD'
      );

      expect(result).toEqual(false);
    });
    it('should return true lazy list which is not excluded', () => {
      const result = component.isDropdownInput(MemberTypes.LazyList, 'any id');

      expect(result).toEqual(true);
    });
  });
  describe('#getControl', () => {
    it('should return give form control from meta', () => {
      const mockedFormControl = new FormControl('test');
      const mockedFormGroup = new FormGroup({ value: mockedFormControl });
      component['meta'].control = mockedFormGroup;

      const result = component.control;

      expect(result).toEqual(mockedFormControl);
    });

    it('should return a new form control if meta has none', () => {
      component['meta'].control = undefined;

      const result = component.control;

      expect(JSON.stringify(result)).toBe(JSON.stringify(new FormControl('')));
    });
  });

  describe('#connectRuntime', () => {
    it('should call runtime on value changes', (done) => {
      const mockedFormControl = new FormControl(false);
      const mockedFormGroup = new FormGroup({ value: mockedFormControl });
      const mockedRuntime = jest.fn(() => true);
      component['meta'].member = {
        ...component['meta'].member,
        type: MemberTypes.Boolean,
        defaultValue: false,
      };
      component['meta'].control = mockedFormGroup;
      component['meta'].runtime = mockedRuntime;

      component['connectRuntime']();

      component.control.valueChanges.subscribe(() => {
        expect(mockedRuntime).toHaveBeenCalledWith(true);
        done();
      });

      component.control.patchValue(true);
    });
  });

  describe('preselectOnlyOption', () => {
    it('should preselect an option if there is no other available', () => {
      const listValues$ = new Subject<ListMember[]>();
      const ops = [
        {
          id: 'testId',
          text: 'someText',
          value: 'someValue',
        },
      ] as ListMember[];

      component.options$ = listValues$.asObservable();
      component['preselectOnlyOption']();
      listValues$.next(ops);

      expect(component.control.value).toEqual(ops[0].id);
      expect(component.meta.control.get('value').value).toEqual(ops[0].id);
    });
  });

  describe('when filtering options', () => {
    it('should filter option which match', () => {
      const option: StringOption = {
        id: '1',
        title: 'Test 1',
      };

      const value = '  tEsT 1   ';

      expect(component.filterFn(option, value)).toBe(true);
    });

    it('should filter option which not match', () => {
      const option: StringOption = {
        id: '1',
        title: 'Test 1',
      };

      const value = '  tEsT 2   ';

      expect(component.filterFn(option, value)).toBe(false);
    });

    it('should return true for empty / not provided filter values', () => {
      const option: StringOption = {
        id: '1',
        title: 'Test 1',
      };

      const value = '';

      expect(component.filterFn(option, value)).toBe(true);
    });
  });

  describe('setSelectedOption', () => {
    it('should preselect the option for the select component', () => {
      const listValues$ = new Subject<ListMember[]>();
      const ops = [
        {
          id: 'testId',
          text: 'someText',
          value: 'someValue',
        },
      ] as ListMember[];

      component.options$ = listValues$.asObservable();
      component.control.setValue('testId');

      component['setSelectedOption']();

      listValues$.next(ops);

      expect(component.selectedOption).toEqual(ops[0]);
    });
  });

  // TODO: implement tests for setupOptions
});
