import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { MmHostMappingPipe } from '@mm/shared/pipes/mm-host-mapping.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockPipe } from 'ng-mocks';

import { PictureCardModule } from '@schaeffler/picture-card';

import { MagneticSliderComponent } from '../../magnetic-slider/magnetic-slider.component';
import { PictureCardListComponent } from './picture-card-list.component';

const mockFn = (): void => {};
describe('PictureCardListComponent', () => {
  let component: PictureCardListComponent;
  let spectator: Spectator<PictureCardListComponent>;

  const createComponent = createComponentFactory({
    component: PictureCardListComponent,
    imports: [PictureCardModule, MockPipe(MmHostMappingPipe, () => 'mocked')],
    declarations: [PictureCardListComponent, MagneticSliderComponent],
    providers: [
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

  describe('#writeValue', () => {
    it('should set value', () => {
      const mockValue = 'mockValueString';
      const spy = jest.spyOn(component['cdRef'], 'markForCheck');

      component.writeValue(mockValue);
      expect(component.value).toEqual(mockValue);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#registerOnChange', () => {
    it('should call onChange method', () => {
      component.registerOnChange(mockFn);
      expect(component['onChange']).toEqual(mockFn);
    });
  });

  describe('#registerOnTouched', () => {
    it('should call onTouched method', () => {
      component.registerOnTouched(mockFn);
      expect(component['onTouched']).toEqual(mockFn);
    });
  });

  describe('#setDisabledState', () => {
    it('should set disabled var', () => {
      component.setDisabledState(false);
      expect(component.disabled).toEqual(false);
    });
  });

  describe('#setValue', () => {
    it('should trigger multiple things', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const changeSpy = jest.spyOn(component, 'onChange');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const touchSpy = jest.spyOn(component, 'onTouched');

      const mockValue = 'mockString';
      component.setValue(mockValue);
      expect(component.value).toEqual(mockValue);
      expect(changeSpy).toHaveBeenCalledWith(mockValue);
      expect(touchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#triggerChange', () => {
    it('should call onChange and onTouched', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const changeSpy = jest.spyOn(component, 'onChange');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const touchSpy = jest.spyOn(component, 'onTouched');
      const expectedValue = 'joa';

      component.value = expectedValue;

      component.triggerChange();

      expect(changeSpy).toHaveBeenCalledWith(expectedValue);
      expect(touchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
