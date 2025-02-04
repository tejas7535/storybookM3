/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { BehaviorSubject } from 'rxjs';

import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { SectorGpsdModule } from '@gq/core/store/sector-gpsd/sector-gpsd.module';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SectorGpsdSelectComponent } from './sector-gpsd-select.component';

describe('SectorGpsdSelectComponent', () => {
  let component: SectorGpsdSelectComponent;
  let spectator: Spectator<SectorGpsdSelectComponent>;

  const sectorGpsds$$: BehaviorSubject<SectorGpsd[]> = new BehaviorSubject<
    SectorGpsd[]
  >(undefined);
  const sectorGpsdLoading$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  const createComponent = createComponentFactory({
    component: SectorGpsdSelectComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatSelectModule,
      PushPipe,
    ],
    providers: [
      provideMockStore({}),
      MockProvider(SectorGpsdFacade, {
        sectorGpsds$: sectorGpsds$$.asObservable(),
        sectorGpsdLoading$: sectorGpsdLoading$$.asObservable(),
      }),
    ],
    overrideComponents: [
      [
        SectorGpsdSelectComponent,
        {
          remove: { imports: [SectorGpsdModule] },
        },
      ],
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Display and selection Behavior', () => {
    beforeEach(() => {
      component['selectedSectorGpsd'] = null;
      component.sectorGpsdControl.disable();
    });

    test('should select the first gpsd when standard option is not in the list', () => {
      const gpsd1 = { name: 'test', id: 'test' };
      const gpsd2 = { name: 'test2', id: 'test2' };
      sectorGpsds$$.next([gpsd1, gpsd2]);
      expect(component['selectedSectorGpsd']).toEqual(gpsd1);
      expect(component.sectorGpsdControl.disabled).toBeFalsy();
      expect(component.sectorGpsdControl.value).toEqual(gpsd1);
    });

    test('should set disabled to FormControl when received gpsd list is undefined', () => {
      component.sectorGpsdControl.enable();
      component.sectorGpsdControl.setValue(undefined);
      sectorGpsds$$.next(undefined as unknown as SectorGpsd[]);
      expect(component.sectorGpsdControl.disabled).toBeTruthy();
    });

    test(
      'should add Not_Available to the gpsd list when received gpsd list is empty and select it',
      marbles((m) => {
        sectorGpsds$$.next([]);
        m.expect(component['sectorGpsds$']).toBeObservable('(a)', {
          a: [component.NOT_AVAILABLE],
        });
        expect(component['selectedSectorGpsd']).toEqual(
          component.NOT_AVAILABLE
        );
        expect(component.sectorGpsdControl.disabled).toBeTruthy();
        expect(component.sectorGpsdControl.value).toEqual(
          component.NOT_AVAILABLE
        );
      })
    );

    test(
      'should add Not_Available to the gpsd list when edit mode is enabled',
      marbles((m) => {
        spectator.setInput('isEditMode', () => true);
        const gpsd1 = { name: 'test', id: 'test' };
        const gpsd2 = { name: 'test2', id: 'test2' };
        sectorGpsds$$.next([gpsd1, gpsd2]);
        m.expect(component['sectorGpsds$']).toBeObservable('(a)', {
          a: [component.NOT_AVAILABLE, gpsd1, gpsd2],
        });
        expect(component['selectedSectorGpsd']).toEqual(
          component.NOT_AVAILABLE
        );
      })
    );

    test(
      'should set Not_Available as selectedSectorGpsd when edit mode is enabled and initial value is null',
      marbles((m) => {
        spectator.setInput('isEditMode', () => true);
        component.sectorGpsdControl.setValue(null);
        const gpsd1 = { name: 'test', id: 'test' };
        const gpsd2 = { name: 'test2', id: 'test2' };
        sectorGpsds$$.next([gpsd1, gpsd2]);
        m.expect(component['sectorGpsds$']).toBeObservable('(a)', {
          a: [component.NOT_AVAILABLE, gpsd1, gpsd2],
        });
        expect(component['selectedSectorGpsd']).toEqual(
          component.NOT_AVAILABLE
        );
        expect(component.sectorGpsdControl.value).toEqual(
          component.NOT_AVAILABLE
        );
      })
    );

    test(
      'should not set Not_Available as selectedSectorGpsd when edit mode is enabled and initial value is set',
      marbles((m) => {
        spectator.setInput('isEditMode', () => true);
        const gpsd1 = { name: 'test', id: 'test' };
        component['selectedSectorGpsd'] = gpsd1;
        component['onChange'] = jest.fn();
        component['onTouched'] = jest.fn();
        sectorGpsds$$.next([gpsd1]);
        m.expect(component['sectorGpsds$']).toBeObservable('(a)', {
          a: [gpsd1],
        });
        expect(component['selectedSectorGpsd'].id).toEqual(gpsd1.id);
      })
    );

    test('should select the only gpsd in the list and emit it', () => {
      const gpsd = { name: 'test', id: 'test' };
      sectorGpsds$$.next([gpsd]);
      expect(component['selectedSectorGpsd']).toEqual(gpsd);
      expect(component.sectorGpsdControl.disabled).toBeFalsy();
      expect(component.sectorGpsdControl.value).toEqual(gpsd);
    });

    test('should select the standard option when more than one gpsd is in the list', () => {
      const gpsd = { name: 'test', id: 'test' };
      sectorGpsds$$.next([gpsd, component.DEFAULT]);
      expect(component['selectedSectorGpsd']).toEqual(component.DEFAULT);
      expect(component.sectorGpsdControl.disabled).toBeFalsy();
      expect(component.sectorGpsdControl.value).toEqual(component.DEFAULT);
    });

    test('should not override selectedSectorGpsd when it is set by a formControl', () => {
      const gpsd = { name: 'test', id: 'test' };
      component['selectedSectorGpsd'] = gpsd;
      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();
      component.writeValue = jest.fn();
      component.setDisabledState = jest.fn();
      component.sectorGpsdSelected.emit = jest.fn();

      sectorGpsds$$.next([
        { name: 'test1', id: 'test1' },
        { name: 'test2', id: 'test2' },
        { name: 'test3', id: 'test3' },
      ]);

      expect(component.writeValue).not.toHaveBeenCalled();
      expect(component.setDisabledState).not.toHaveBeenCalled();
      expect(component.sectorGpsdSelected.emit).not.toHaveBeenCalledWith(gpsd);

      expect(component['selectedSectorGpsd']).toEqual(gpsd);
    });

    test('should add selected gpsd to gpsds if not available in gpsds (ordered)', (done) => {
      const gpsd1 = { name: 'test', id: '123' };
      const gpsd2 = { name: 'test2', id: '3443' };
      const selected = { name: 'test3', id: '213' };

      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();
      component['selectedSectorGpsd'] = selected;
      sectorGpsds$$.next([gpsd1, gpsd2]);
      component['sectorGpsds$'].pipe().subscribe((val) => {
        expect(val).toEqual([gpsd1, selected, gpsd2]);
        done();
      });
    });
  });
  describe('selectionChange', () => {
    test('should emit sectorGpsdSelected', () => {
      const sectorGpsd = { name: 'test', id: 'test' };
      const event = {
        value: sectorGpsd,
      } as MatSelectChange;
      component.sectorGpsdSelected.emit = jest.fn();
      component.selectionChange(event);
      expect(component.sectorGpsdSelected.emit).toHaveBeenCalledWith(
        event.value
      );
    });

    test('should emit undefined for emptyValue', () => {
      const event = {
        value: component.NOT_AVAILABLE,
      } as MatSelectChange;
      component.sectorGpsdSelected.emit = jest.fn();
      component.selectionChange(event);
      expect(component.sectorGpsdSelected.emit).toHaveBeenCalledWith(undefined);
    });
    test('should call onChange and onTouch if set', () => {
      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();
      component.selectionChange({ value: 'test' } as MatSelectChange);
      expect(component['onChange']).toHaveBeenCalledWith('test');
      expect(component['onTouched']).toHaveBeenCalled();
    });
  });

  describe('compareFn', () => {
    test('should return true for same id', () => {
      const result = component.compareFn(
        { id: 'test' } as SectorGpsd,
        { id: 'test' } as SectorGpsd
      );
      expect(result).toBeTruthy();
    });
  });

  describe('Accessor functions', () => {
    test('writeValue should set components selectedType', () => {
      component.writeValue({ name: 'test', id: 'test' } as SectorGpsd);
      expect(component['selectedSectorGpsd']).toEqual({
        name: 'test',
        id: 'test',
      });
    });

    test('registerOnChange should set onChange', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      expect(component['onChange']).toEqual(onChange);
    });

    test('registerOnTouched should set onTouched', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);
      expect(component['onTouched']).toEqual(onTouched);
    });

    test('setDisabledState should set the disabled state to true of the formControl', () => {
      component.setDisabledState(true);
      expect(component.sectorGpsdControl.disabled).toEqual(true);
    });
    test('setDisabledState should set the disabled state to false of the formControl', () => {
      component.setDisabledState(false);
      expect(component.sectorGpsdControl.disabled).toEqual(false);
    });
  });

  describe('getValueToEmit', () => {
    test('should return the selectedSectorGpsd if it is not NOT_AVAILABLE', () => {
      component['selectedSectorGpsd'] = { name: 'test', id: 'test' };
      expect(component['getValueToEmit']()).toEqual({
        name: 'test',
        id: 'test',
      });
    });

    test('should return undefined if selectedSectorGpsd is NOT_AVAILABLE', () => {
      component['selectedSectorGpsd'] = component.NOT_AVAILABLE;
      expect(component['getValueToEmit']()).toBeUndefined();
    });
  });

  describe('sectorGpsdLoading$', () => {
    const gpsd = { name: 'test', id: 'test' };
    test(
      'should not set selectedSectorGpsd to null',
      marbles(() => {
        component['selectedSectorGpsd'] = gpsd;
        spectator.setInput('isEditMode', () => true);
        sectorGpsdLoading$$.next(true);
        expect(component.sectorGpsdLoading$).toBeTruthy();
        expect(component['selectedSectorGpsd'].id).toEqual(gpsd.id);
      })
    );
    test(
      'should set selectedSectorGpsd to null',
      marbles(() => {
        component['selectedSectorGpsd'] = gpsd;
        sectorGpsdLoading$$.next(true);
        expect(component.sectorGpsdLoading$).toBeTruthy();
        expect(component['selectedSectorGpsd']).toEqual(null);
      })
    );
  });
});
