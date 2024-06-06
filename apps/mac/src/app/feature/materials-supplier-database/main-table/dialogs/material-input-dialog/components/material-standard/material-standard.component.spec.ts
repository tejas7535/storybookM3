import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule, MockPipe, MockProvider } from 'ng-mocks';

import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';
import { MaterialStandard } from '@mac/msd/models';
import { initialState as initialDataState } from '@mac/msd/store/reducers/data/data.reducer';
import { initialState as initialDialogState } from '@mac/msd/store/reducers/dialog/dialog.reducer';

import * as en from '../../../../../../../../assets/i18n/en.json';
import { DialogControlsService } from '../../services';
import { MaterialStandardComponent } from './material-standard.component';

const initialState = {
  msd: {
    data: {
      ...initialDataState,
    },
    dialog: {
      ...initialDialogState,
      dialogOptions: {
        ...initialDialogState.dialogOptions,
        ratingsLoading: false,
        materialStandards: [] as MaterialStandard[],
      },
    },
  },
};

@Injectable()
class MockDialogFacade extends DialogFacade {
  addCustomMaterialStandardDocument = jest.fn();
  addCustomMaterialStandardName = jest.fn();
}

describe('MaterialStandardComponent', () => {
  let component: MaterialStandardComponent;
  let spectator: Spectator<MaterialStandardComponent>;
  let dialogFacade: DialogFacade;
  const stdDocControl = new FormControl<StringOption>(undefined);
  const matNameControl = new FormControl<StringOption>(undefined);
  const idControl = new FormControl<number>(undefined);

  const createComponent = createComponentFactory({
    component: MaterialStandardComponent,
    // required so we can set the inputs
    detectChanges: false,
    imports: [
      MockPipe(PushPipe),
      MockModule(ReactiveFormsModule),
      MockModule(SelectModule),
      provideTranslocoTestingModule({ en }),
    ],

    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => of()),
      DialogControlsService,
      MockProvider(DialogFacade, MockDialogFacade, 'useClass'),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({
      standardDocumentsControl: stdDocControl,
      materialNamesControl: matNameControl,
      materialStandardIdControl: idControl,
    });
    // run ngOnInit
    spectator.detectChanges();

    component = spectator.debugElement.componentInstance;

    dialogFacade = spectator.inject(DialogFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formControls', () => {
    // prepared values
    const matNameOption: StringOption = {
      id: 77,
      title: 'matName',
      data: {
        standardDocuments: [{ id: 1, standardDocument: 'standard documents' }],
      },
    } as StringOption;
    const stdDocOption: StringOption = {
      id: 42,
      title: 'stdDoc',
      data: {
        materialNames: [{ id: 1, materialName: 'materialName value' }],
      },
    } as StringOption;
    describe('ADD - StandardDocumentsControl valueChanges', () => {
      beforeEach(() => {
        matNameControl.reset(undefined, { emitEvent: false });
        stdDocControl.reset(undefined, { emitEvent: false });
        // prepare mocks
        component.viewMode = '';
        component['reset'] = jest.fn();
        idControl.setValue = jest.fn();
      });
      it('should reset id and materialNames when stdDoc is undefined', () => {
        // prepare
        matNameControl.setValue(matNameOption, { emitEvent: false });
        stdDocControl.setValue(stdDocOption, { emitEvent: false });
        // start patch
        stdDocControl.reset();

        expect(component['reset']).toHaveBeenCalledWith(matNameControl);
        expect(component['reset']).toHaveBeenCalledWith(idControl);
        expect(component['reset']).not.toHaveBeenCalledWith(stdDocControl);
      });
      it('should patch id and NOT reset materialNames with equal data', () => {
        // prepare
        matNameControl.setValue(matNameOption, { emitEvent: false });
        // start patch
        stdDocControl.patchValue({
          ...stdDocOption,
          data: {
            materialNames: [{ id: 100, materialName: matNameOption.title }],
          },
        } as StringOption);

        expect(component['reset']).not.toHaveBeenCalledWith(matNameControl);
        expect(component['reset']).not.toHaveBeenCalledWith(idControl);
        expect(component['reset']).not.toHaveBeenCalledWith(stdDocControl);
        expect(idControl.setValue).toHaveBeenCalledWith(100);
      });
      it('should patch id and NOT reset materialNames with custom material name', () => {
        // prepare
        matNameControl.setValue(
          {
            id: undefined,
            title: 'customMatName',
          } as StringOption,
          {
            emitEvent: false,
          }
        );
        // start patch
        stdDocControl.setValue(stdDocOption);

        expect(component['reset']).toHaveBeenCalledWith(idControl);
        expect(component['reset']).not.toHaveBeenCalledWith(matNameControl);
      });
      it('should patch id and NOT reset materialNames with custom standard document', () => {
        // prepare
        matNameControl.setValue(matNameOption, {
          emitEvent: false,
        });
        // start patch
        stdDocControl.setValue({
          id: undefined,
          title: 'custom standard document',
        } as StringOption);
        expect(component['reset']).toHaveBeenCalledWith(idControl);
        expect(component['reset']).not.toHaveBeenCalledWith(matNameControl);
      });

      it('should reset materialNames', () => {
        // prepare
        matNameControl.setValue(matNameOption, { emitEvent: false });
        // start patch
        stdDocControl.setValue(stdDocOption);

        expect(component['reset']).toHaveBeenCalledWith(matNameControl);
      });

      it('should NOT patch id and NOT reset materialNames with matName not set', () => {
        // start patch
        stdDocControl.setValue(stdDocOption);

        expect(component['reset']).not.toHaveBeenCalledWith(matNameControl);
        expect(idControl.setValue).not.toHaveBeenCalled();
      });
    });
    describe('ADD - materialNamesControl valueChanges', () => {
      beforeEach(() => {
        // prepare
        matNameControl.setValue(undefined, { emitEvent: false });
        stdDocControl.setValue(undefined, { emitEvent: false });
        // prepare mocks
        component.readonly = false;
        component.editable = false;
        component['reset'] = jest.fn();
        idControl.setValue = jest.fn();
      });
      it('should reset id and stdDoc when matName is undefined', () => {
        // prepare
        matNameControl.setValue(matNameOption, { emitEvent: false });
        stdDocControl.setValue(stdDocOption, { emitEvent: false });
        idControl.setValue(3, { emitEvent: false });
        // start patch
        matNameControl.reset();

        expect(component['reset']).toHaveBeenCalledWith(stdDocControl);
        expect(component['reset']).toHaveBeenCalledWith(idControl);
      });
      it('should patch createMaterialForm and NOT reset stdDoc with equal data', () => {
        // prepare
        stdDocControl.setValue(stdDocOption, {
          emitEvent: false,
        });
        // start patch
        matNameControl.patchValue({
          ...matNameOption,
          data: {
            standardDocuments: [
              { id: 100, standardDocument: stdDocOption.title },
            ],
          },
        } as StringOption);

        expect(component['reset']).not.toHaveBeenCalledWith(stdDocControl);
        expect(idControl.setValue).toHaveBeenCalledWith(100);
      });

      it('should patch createMaterialForm and NOT reset stdDoc with custom std doc', () => {
        // prepare
        stdDocControl.setValue(
          { id: undefined, title: 'customStdDoc' } as StringOption,
          {
            emitEvent: false,
          }
        );
        // start patch
        matNameControl.setValue(matNameOption);

        expect(component['reset']).not.toHaveBeenCalledWith(stdDocControl);
        expect(component['reset']).toHaveBeenCalledWith(idControl);
      });

      it('should patch createMaterialForm and NOT reset stdDoc with custom matName', () => {
        // prepare
        stdDocControl.setValue(stdDocOption, {
          emitEvent: false,
        });
        // start patch
        matNameControl.setValue({
          id: undefined,
          title: 'customMatName',
        } as StringOption);

        expect(component['reset']).not.toHaveBeenCalledWith(stdDocControl);
        expect(component['reset']).toHaveBeenCalledWith(idControl);
      });

      it('should reset stadnard document', () => {
        // prepare
        stdDocControl.setValue(stdDocOption, { emitEvent: false });
        // start patch
        matNameControl.setValue(matNameOption);

        expect(component['reset']).toHaveBeenCalledWith(stdDocControl);
      });

      it('should NOT patch id and NOT reset standard Document with stdDoc not set', () => {
        // start patch
        matNameControl.setValue(matNameOption);

        expect(component['reset']).not.toHaveBeenCalledWith(stdDocControl);
        expect(component['reset']).not.toHaveBeenCalledWith(idControl);
        expect(idControl.setValue).not.toHaveBeenCalled();
      });
    });

    describe('EDIT - update select on edit change', () => {
      beforeEach(() => {
        component.editable = true;
        component.readonly = false;
        component.ngOnInit();
        component.ngAfterViewInit();
      });
      it('should update materialName', () => {
        const val = 'sth';
        const so = { title: val } as StringOption;

        component.materialNamesEditControl.setValue(val);
        expect(component.materialNamesControl.value).toEqual(so);
      });
      it('should update standardDocument', () => {
        const val = 'sth';
        const so = { title: val } as StringOption;

        component.standardDocumentsEditControl.setValue(val);
        expect(component.standardDocumentsControl.value).toEqual(so);
      });
    });
  });

  describe('onUpdateStandardDocument', () => {
    it('should reset material standard on standardDocument reset', () => {
      component['reset'] = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      component['onUpdateStandardDocument'](undefined);

      expect(component['reset']).toHaveBeenCalledWith(
        component.materialStandardIdControl
      );
      expect(component['reset']).toHaveBeenCalledWith(
        component.materialNamesControl
      );
    });

    it('should set the material standard id', () => {
      component.materialStandardIdControl.setValue = jest.fn();
      component.materialNamesControl.setValue(
        { id: 2, title: 'mat' },
        { emitEvent: false }
      );

      const mockStandardDocument: StringOption = {
        id: 1,
        title: 'std',
        data: {
          materialNames: [{ id: 2, materialName: 'mat' }],
        },
      };

      component['onUpdateStandardDocument'](mockStandardDocument);

      expect(component.materialStandardIdControl.setValue).toHaveBeenCalledWith(
        2
      );
    });

    it('should reset the material name', () => {
      component['reset'] = jest.fn();
      component.materialNamesControl.setValue(
        { id: 2, title: 'mat' },
        { emitEvent: false }
      );

      const mockStandardDocument: StringOption = {
        id: 1,
        title: 'std',
        data: {
          materialNames: [],
        },
      };

      component['onUpdateStandardDocument'](mockStandardDocument);

      expect(component['reset']).toHaveBeenCalledWith(
        component.materialNamesControl
      );
    });

    it('should reset the material standard id for custom entries', () => {
      component['reset'] = jest.fn();
      component.materialNamesControl.setValue(
        { id: undefined, title: 'mat' },
        { emitEvent: false }
      );

      const mockStandardDocument: StringOption = {
        id: 1,
        title: 'std',
        data: {
          materialNames: [],
        },
      };

      component['onUpdateStandardDocument'](mockStandardDocument);

      expect(component['reset']).toHaveBeenCalledWith(
        component.materialStandardIdControl
      );
    });
  });

  describe('onUpdateMaterialName', () => {
    it('should reset material standard on materialName reset', () => {
      component['reset'] = jest.fn();

      // eslint-disable-next-line unicorn/no-useless-undefined
      component['onUpdateMaterialName'](undefined);

      expect(component['reset']).toHaveBeenCalledWith(
        component.materialStandardIdControl
      );
      expect(component['reset']).toHaveBeenCalledWith(
        component.standardDocumentsControl
      );
    });

    it('should set the material standard id', () => {
      component.materialStandardIdControl.setValue = jest.fn();
      component.standardDocumentsControl.setValue(
        { id: 2, title: 'std' },
        { emitEvent: false }
      );

      const mockMaterialName: StringOption = {
        id: 1,
        title: 'mat',
        data: {
          standardDocuments: [{ id: 2, standardDocument: 'std' }],
        },
      };

      component['onUpdateMaterialName'](mockMaterialName);

      expect(component.materialStandardIdControl.setValue).toHaveBeenCalledWith(
        2
      );
    });

    it('should reset the standard document', () => {
      component['reset'] = jest.fn();
      component.standardDocumentsControl.setValue(
        { id: 2, title: 'std' },
        { emitEvent: false }
      );

      const mockMaterialName: StringOption = {
        id: 1,
        title: 'mat',
        data: {
          standardDocuments: [],
        },
      };

      component['onUpdateMaterialName'](mockMaterialName);

      expect(component['reset']).toHaveBeenCalledWith(
        component.standardDocumentsControl
      );
    });

    it('should reset the material standard id for custom entries', () => {
      component['reset'] = jest.fn();
      component.standardDocumentsControl.setValue(
        { id: undefined, title: 'std' },
        { emitEvent: false }
      );

      const mockMaterialName: StringOption = {
        id: 1,
        title: 'mat',
        data: {
          standardDocuments: [],
        },
      };

      component['onUpdateMaterialName'](mockMaterialName);

      expect(component['reset']).toHaveBeenCalledWith(
        component.materialStandardIdControl
      );
    });
  });

  describe('reset', () => {
    it('should reset the control', () => {
      const mockControl = new FormControl<string>(undefined);
      mockControl.reset = jest.fn();

      component['reset'](mockControl);

      expect(mockControl.reset).toHaveBeenCalledWith(undefined, {
        emitEvent: false,
      });
    });
  });

  describe('addStandardDocument', () => {
    it('should dispatch the action', () => {
      component.addStandardDocument('');

      expect(
        dialogFacade.addCustomMaterialStandardDocument
      ).toHaveBeenCalledWith('');
    });
  });

  describe('addMaterialName', () => {
    it('should dispatch the action', () => {
      component.addMaterialName('');

      expect(dialogFacade.addCustomMaterialStandardName).toHaveBeenCalledWith(
        ''
      );
    });
  });

  describe('materialNameFilterFnFactory', () => {
    const option: StringOption = { id: 78, title: 'aBcDeFgH' };

    it('should return true with no std doc set', () => {
      const standardDocumentsControl = new FormControl<StringOption>(undefined);
      expect(
        component.materialNameFilterFnFactory(standardDocumentsControl)(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with no "data" in  std doc set', () => {
      const stdDoc: StringOption = {
        id: 11,
        title: 'aBcDeFgH',
      };
      const standardDocumentsControl = new FormControl<StringOption>(stdDoc);
      expect(
        component.materialNameFilterFnFactory(standardDocumentsControl)(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with matching materialName', () => {
      const stdDoc: StringOption = {
        id: 24,
        title: 'aBcDeFgH',
        data: { materialNames: [{ id: 1, materialName: option.title }] },
      };
      const standardDocumentsControl = new FormControl<StringOption>(stdDoc);
      expect(
        component.materialNameFilterFnFactory(standardDocumentsControl)(option)
      ).toBe(true);
    });

    it('should return false with not matching materialname', () => {
      const stdDoc: StringOption = {
        id: 78,
        title: 'aBcDeFgH',
        data: { materialNames: [{ id: 1, materialName: 'other matName' }] },
      };
      const standardDocumentsControl = new FormControl<StringOption>(stdDoc);
      expect(
        component.materialNameFilterFnFactory(standardDocumentsControl)(
          option,
          option.title
        )
      ).toBeFalsy();
    });
  });

  describe('standardDocumentFilterFnFactory', () => {
    const option: StringOption = { id: 78, title: 'aBcDeFgH' };

    it('should return true with no material name set', () => {
      const materialNamesControl = new FormControl<StringOption>(undefined);

      expect(
        component.standardDocumentFilterFnFactory(materialNamesControl)(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with no "data" in  material name set', () => {
      const matName: StringOption = {
        id: 11,
        title: 'aBcDeFgH',
      };
      const materialNamesControl = new FormControl<StringOption>(matName);
      expect(
        component.standardDocumentFilterFnFactory(materialNamesControl)(
          option,
          option.title
        )
      ).toBe(true);
    });

    it('should return true with matching standardDocument', () => {
      const matName: StringOption = {
        id: 24,
        title: 'aBcDeFgH',
        data: {
          standardDocuments: [{ id: 1, standardDocument: option.title }],
        },
      };
      const materialNamesControl = new FormControl<StringOption>(matName);
      expect(
        component.standardDocumentFilterFnFactory(materialNamesControl)(option)
      ).toBe(true);
    });

    it('should return false with not matching standardDocument', () => {
      const matName: StringOption = {
        id: 78,
        title: 'aBcDeFgH',
        data: {
          standardDocuments: [
            { id: 1, standardDocument: 'other standard document' },
          ],
        },
      };
      const materialNamesControl = new FormControl<StringOption>(matName);
      expect(
        component.standardDocumentFilterFnFactory(materialNamesControl)(
          option,
          option.title
        )
      ).toBeFalsy();
    });
  });
});
