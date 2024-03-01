import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';

import { MsdDialogService } from '../../services';
import {
  ClassificationClass,
  MaterialEmissionClassificationComponent,
} from './material-emission-classification.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('MaterialEmissionClassificationComponent', () => {
  let component: MaterialEmissionClassificationComponent;
  let spectator: Spectator<MaterialEmissionClassificationComponent>;

  const createComponent = createComponentFactory({
    component: MaterialEmissionClassificationComponent,
    declarations: [MaterialEmissionClassificationComponent],
    providers: [mockProvider(MsdDialogService, { openInfoDialog: jest.fn() })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should check value validity and determineClassificationClass if value is valid', () => {
      component['isValueValid'] = jest.fn(() => true);
      component['determineClassificationClass'] = jest.fn(
        () => ClassificationClass.GREEN
      );

      component.ngOnInit();

      expect(component.valueValid).toBe(true);
      expect(component['determineClassificationClass']).toHaveBeenCalledTimes(
        1
      );
      expect(component.classificationClass).toBe(ClassificationClass.GREEN);
    });

    it('should check value validity but not determineClassificationClass if value is not valid', () => {
      component['isValueValid'] = jest.fn(() => false);
      component['determineClassificationClass'] = jest.fn();

      component.ngOnInit();

      expect(component.valueValid).toBe(false);
      expect(component['determineClassificationClass']).not.toHaveBeenCalled();
      expect(component.classificationClass).toBeUndefined();
    });
  });

  describe('isValueValid', () => {
    it('negative values are valid', () => {
      component.value = -1;
      expect(component['isValueValid']()).toBe(true);
    });
    it('zero values are valid', () => {
      component.value = 0;
      expect(component['isValueValid']()).toBe(true);
    });
    it('positive values are valid', () => {
      component.value = 1;
      expect(component['isValueValid']()).toBe(true);
    });
    it('undefined values are invalid', () => {
      component.value = undefined;
      expect(component['isValueValid']()).toBe(false);
    });
  });

  describe('determineClassificationClass', () => {
    it.each([
      [0, ClassificationClass.GREEN],
      [200, ClassificationClass.GREEN],
      [400, ClassificationClass.GREEN],
      [800, ClassificationClass.MEDIUM_GREEN],
      [1000, ClassificationClass.MEDIUM_GREEN],
      [1200, ClassificationClass.LIGHT_GREEN],
      [1750, ClassificationClass.LIGHT_GREEN],
      [1800, ClassificationClass.GREY],
      [undefined, ClassificationClass.GREY],
    ])('should classify value of <%p> as [%p]', (value, expected) => {
      component.value = value;
      expect(component['determineClassificationClass']()).toBe(expected);
    });
  });

  it('should open the dialog', () => {
    component.openMoreInformation();

    expect(component['dialogService'].openInfoDialog).toHaveBeenCalledWith(
      'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationTitle',
      undefined,
      'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationImg',
      'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationImgCaption',
      undefined,
      'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationContact',
      'materialsSupplierDatabase.mainTable.tooltip.greensteel.moreInformationContactLink'
    );
  });
});
