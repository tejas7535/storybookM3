import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PictureCardModule } from '@schaeffler/picture-card';

import { MagneticSliderComponent } from '../shared/components/magnetic-slider/magnetic-slider.component';
import { PictureCardListComponent } from './picture-card-list.component';

describe('PictureCardListComponent', () => {
  let component: PictureCardListComponent;
  let spectator: Spectator<PictureCardListComponent>;

  const createComponent = createComponentFactory({
    component: PictureCardListComponent,
    imports: [PictureCardModule],
    declarations: [PictureCardListComponent, MagneticSliderComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('writeValue set value', () => {
    const mockValue = 'mockValueString';
    const spy = jest.spyOn(component['cdRef'], 'markForCheck');

    component.writeValue(mockValue);
    expect(component.value).toEqual(mockValue);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('registerOnChange call onChange method', () => {
    const mockFn = () => {};

    component.registerOnChange(mockFn);
    expect(component['onChange']).toEqual(mockFn);
  });

  test('registerOnTouched call onTouched method', () => {
    const mockFn = () => {};

    component.registerOnTouched(mockFn);
    expect(component['onTouched']).toEqual(mockFn);
  });

  test('setDisabledState should set disabled var', () => {
    component.setDisabledState(false);
    expect(component.disabled).toEqual(false);
  });

  test('setValue should trigger multiple things', () => {
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
