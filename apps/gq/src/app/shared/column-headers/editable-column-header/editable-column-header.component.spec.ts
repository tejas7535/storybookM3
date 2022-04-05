import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { QuotationDetail } from '../../models/quotation-detail';
import { HelperService } from '../../services/helper-service/helper-service.service';
import { EditableColumnHeaderComponent } from './editable-column-header.component';

describe('EditableColumnHeaderComponent', () => {
  let component: EditableColumnHeaderComponent;
  let spectator: Spectator<EditableColumnHeaderComponent>;

  const DEFAULT_PARAMS = {
    template: '',
    displayName: 'Test',
    enableMenu: true,
    enableSorting: true,
    context: { onMultipleMaterialSimulation: jest.fn() },
    column: {
      addEventListener: jest.fn(),
      isSortAscending: jest.fn(),
      isSortDescending: jest.fn(),
      getId: jest.fn().mockReturnValue('price'),
    } as any,
    api: {
      addEventListener: jest.fn(),
      getSelectedRows: jest.fn().mockReturnValue([]),
    } as any,
    columnApi: {} as any,
    eGridHeader: {} as any,
    showColumnMenu: jest.fn(),
    setSort: jest.fn(),
    progressSort: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: EditableColumnHeaderComponent,
    imports: [MatIconModule, MatInputModule, ReactiveFormsModule, FormsModule],
    providers: [],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.params = DEFAULT_PARAMS;
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('onSortChanged', () => {
    it('should set the sort to asc from the params', () => {
      component.params = {
        ...DEFAULT_PARAMS,
        column: {
          isSortAscending: jest.fn().mockReturnValue(true),
          isSortDescending: jest.fn().mockReturnValue(false),
        } as any,
      };

      spectator.detectChanges();
      expect(component.sort).toEqual(undefined);

      component.onSortChanged();
      expect(component.sort).toEqual('asc');
    });

    it('should set the sort to desc from the params', () => {
      component.params = {
        ...DEFAULT_PARAMS,
        column: {
          isSortAscending: jest.fn().mockReturnValue(false),
          isSortDescending: jest.fn().mockReturnValue(true),
        } as any,
      };

      spectator.detectChanges();
      expect(component.sort).toEqual(undefined);

      component.onSortChanged();
      expect(component.sort).toEqual('desc');
    });

    it('should set the sort to none from the params', () => {
      component.params = {
        ...DEFAULT_PARAMS,
        column: {
          isSortAscending: jest.fn().mockReturnValue(false),
          isSortDescending: jest.fn().mockReturnValue(false),
        } as any,
      };

      spectator.detectChanges();
      expect(component.sort).toEqual(undefined);

      component.onSortChanged();
      expect(component.sort).toEqual(undefined);
    });
  });

  describe('onMenuClicked', () => {
    it('should call the showColumnMenu function', () => {
      component.menuButton = { nativeElement: {} } as any;
      component.onMenuClicked({
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as any);

      expect(component.params.showColumnMenu).toHaveBeenCalledWith(
        component.menuButton.nativeElement
      );
    });
  });

  describe('onSortRequested', () => {
    it('should call setSort with undefined if it was desc', () => {
      component.sort = 'desc';
      spectator.detectChanges();

      component.onSortRequested({ shiftKey: false } as MouseEvent);

      expect(component.params.setSort).toHaveBeenCalledWith(undefined, false);
    });

    it('should call setSort with asc if it was none', () => {
      component.sort = undefined;
      spectator.detectChanges();

      component.onSortRequested({ shiftKey: false } as MouseEvent);

      expect(component.params.setSort).toHaveBeenCalledWith('asc', false);
    });

    it('should call setSort with desc if it was asc', () => {
      component.sort = 'asc';
      spectator.detectChanges();

      component.onSortRequested({ shiftKey: false } as MouseEvent);

      expect(component.params.setSort).toHaveBeenCalledWith('desc', false);
    });
  });

  describe('enableEditMode', () => {
    it('should enable edit Mode', () => {
      component.enableEditMode({
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as any);

      expect(component.editMode).toBe(true);
    });
  });

  describe('disableEditMode', () => {
    beforeEach(() => {
      spectator.detectChanges();
      component.agInit(DEFAULT_PARAMS);
      component.editMode = true;
    });

    it("should disable editMode if the user didn't enter a value", () => {
      component.editFormControl.setValue(15);
      component.submitValue({ stopPropagation: jest.fn() } as any);

      component.disableEditMode();

      expect(component.editMode).toEqual(true);
    });

    it("should not disable editMode if the user didn't enter any values", () => {
      component.disableEditMode();
      spectator.detectChanges();

      expect(component.editMode).toEqual(false);
    });
  });

  describe('submitValue', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      spectator.detectChanges();
      component.agInit(DEFAULT_PARAMS);
    });

    it('should not submit if the value is bigger then 100', () => {
      component.editFormControl.setValue(101);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).not.toHaveBeenCalled();
    });

    it('should not submit if the value is bigger less then -100', () => {
      component.editFormControl.setValue(-101);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(
        component.params.context.onMultipleMaterialSimulation
      ).not.toHaveBeenCalled();
    });

    it('should submit if the form is valid', () => {
      component.editFormControl.setValue(25.05);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(component.value).toEqual(25.05);
      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith('price', 25.05);
    });

    it('should submit if the form is valid with a negative value', () => {
      component.editFormControl.setValue(-25.05);

      component.submitValue({ stopPropagation: jest.fn() } as any);

      expect(component.value).toEqual(-25.05);
      expect(
        component.params.context.onMultipleMaterialSimulation
      ).toHaveBeenCalledWith('price', -25.05);
    });
  });

  describe('validate input', () => {
    beforeEach(() => {
      spectator.detectChanges();
      component.agInit(DEFAULT_PARAMS);
    });

    it('should validate number input onKeyPress', () => {
      HelperService.validateNumberInputKeyPress = jest.fn();

      component.onKeyPress({ preventDefault: jest.fn() } as any);
      expect(HelperService.validateNumberInputKeyPress).toHaveBeenCalledTimes(
        1
      );
    });

    it('should validate number input onPaste', () => {
      HelperService.validateNumberInputPaste = jest.fn();

      component.onPaste({
        clipboardData: { getData: jest.fn() },
        preventDefault: jest.fn(),
      } as any);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledTimes(1);
    });
  });

  describe('Enable edit icon', () => {
    it('should not show the edit icon by default', () => {
      spectator.detectChanges();
      component.params.column.getId = jest.fn().mockReturnValue('price');

      expect(component.showEditIcon).toBe(false);
    });

    it('should show the edit icon after row selection', () => {
      spectator.detectChanges();
      component.params.api.getSelectedRows = jest
        .fn()
        .mockReturnValue([{ price: 10 } as QuotationDetail]);

      component.updateShowEditIcon();

      expect(component.showEditIcon).toBe(true);
    });

    it('should hide the edit icon after all rows are deselected', () => {
      spectator.detectChanges();
      component.params.api.getSelectedRows = jest
        .fn()
        .mockReturnValueOnce([{ price: 10 } as QuotationDetail])
        .mockReturnValueOnce([{ price: 10 } as QuotationDetail]);

      component.updateShowEditIcon();

      expect(component.showEditIcon).toBe(true);

      component.updateShowEditIcon();

      expect(component.showEditIcon).toBe(false);
    });
  });
});
